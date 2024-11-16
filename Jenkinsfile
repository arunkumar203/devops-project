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
        
        // Check if containers exist before stopping and removing
        script {
            def frontendExists = sh(script: "docker ps -q -f name=frontend", returnStdout: true).trim()
            def backendExists = sh(script: "docker ps -q -f name=backend", returnStdout: true).trim()

            if (frontendExists) {
                echo 'Stopping frontend container...'
                sh 'docker stop frontend'
                sh 'docker rm frontend'
            } else {
                echo 'Frontend container not found, skipping stop and remove.'
            }

            if (backendExists) {
                echo 'Stopping backend container...'
                sh 'docker stop backend'
                sh 'docker rm backend'
            } else {
                echo 'Backend container not found, skipping stop and remove.'
            }

            // Optionally remove Docker images
            sh 'docker rmi my-frontend my-backend || true'
        }
    }
}
}
