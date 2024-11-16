pipeline {
    agent any
    tools {
        nodejs 'NodeJS'  // Name of your NodeJS installation in Jenkins
    }
    environment {
        FRONTEND_URL = 'http://localhost:3000'  // Frontend URL
        BACKEND_URL = 'http://localhost:5000/health'   // Backend URL
    }
    stages {
        stage('Checkout') {
            steps {
                // Checkout the code from GitHub
                git url: 'https://github.com/arunkumar203/devops-project',
                    branch: 'main'
            }
        }
        stage('Build Docker Images') {
            steps {
                script {
                    // Build Docker images for both frontend and backend
                    echo 'Building Docker images for frontend and backend...'
                    sh 'docker build -t my-frontend ./client'
                    sh 'docker build -t my-backend ./server'
                }
            }
        }
        stage('Run Docker Containers') {
            steps {
                script {
                    // Start both frontend and backend Docker containers
                    echo 'Starting frontend and backend Docker containers...'
                    sh 'docker run -d -p 3000:3000 --name frontend my-frontend'
                    sh 'docker run -d -p 5000:5000 --name backend my-backend'
                    
                    // Wait for a few seconds to ensure the app is up
                    sleep 10
                }
            }
        }
        stage('Health Check - Frontend') {
            steps {
                // Check if frontend is up and running
                script {
                    echo 'Checking frontend health...'
                    def response = sh(script: "curl -s -o /dev/null -w '%{http_code}' ${FRONTEND_URL}", returnStdout: true).trim()
                    if (response != '200') {
                        error "Frontend is not responding correctly, received status code: ${response}"
                    } else {
                        echo "Frontend is up and running with status code: ${response}"
                    }
                }
            }
        }
        stage('Health Check - Backend') {
            steps {
                // Check if backend is up and running
                script {
                    echo 'Checking backend health...'
                    def response = sh(script: "curl -s -o /dev/null -w '%{http_code}' ${BACKEND_URL}", returnStdout: true).trim()
                    if (response != '200') {
                        error "Backend is not responding correctly, received status code: ${response}"
                    } else {
                        echo "Backend is up and running with status code: ${response}"
                    }
                }
            }
        }
    }
    post {
        success {
            // Actions on successful build and tests
            echo 'Web app is up and running!'
        }
        failure {
            // Actions on failure
            echo 'Web app is not up, please check the logs.'
        }
        always {
            // Clean up actions
            echo 'Cleaning up...'
            // Stop and remove containers after the test
            script {
                try {
                    sh 'docker stop frontend || true'  // Ignore error if container does not exist
                    sh 'docker stop backend || true'   // Ignore error if container does not exist
                    sh 'docker rm frontend || true'    // Ignore error if container does not exist
                    sh 'docker rm backend || true'     // Ignore error if container does not exist
                    // Optionally remove Docker images
                    sh 'docker rmi my-frontend my-backend || true' // Ignore error if image does not exist
                } catch (e) {
                    echo "Cleanup failed: ${e.getMessage()}"
                }
            }
        }
    }
}
