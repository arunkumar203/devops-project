pipeline {
    agent any
    tools {
        nodejs 'NodeJS'  // Name of your NodeJS installation in Jenkins
    }
    environment {
        FRONTEND_URL = 'http://localhost:3000'  // Frontend URL
        BACKEND_URL = 'http://localhost:5000'   // Backend URL
    }
    stages {
        stage('Checkout') {
            steps {
                // Checkout the code from GitHub
                git url: 'https://github.com/arunkumar203/devops-project',
                    branch: 'main'
            }
        }
        stage('Run Application') {
            steps {
                // Start both the frontend and backend (in background)
                script {
                    // Start backend server with node index.js
                    echo 'Starting backend server...'
                    sh 'cd server &&  node index.js &'

                    // Start frontend server
                    echo 'Starting frontend server...'
                    sh 'cd client &&  npm start &'

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
        }
    }
}

