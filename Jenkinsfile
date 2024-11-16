pipeline {
    agent any
    tools {
        nodejs 'NodeJS'  // Name of your NodeJS installation in Jenkins
    }
    environment {
        FRONTEND_URL = 'http://localhost:3000'  // Frontend URL
        BACKEND_URL = 'http://localhost:5000/health'  // Backend URL
        DOCKER_HUB_REPO_FRONTEND = 'your_dockerhub_username/my-frontend'  // Docker Hub repo for frontend
        DOCKER_HUB_REPO_BACKEND = 'your_dockerhub_username/my-backend'  // Docker Hub repo for backend
    }
    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/arunkumar203/devops-project',
                    branch: 'main'
            }
        }
        stage('Build Docker Images') {
            steps {
                script {
                    echo 'Building Docker images for frontend and backend...'
                    sh 'docker build -t my-frontend ./client'
                    sh 'docker build -t my-backend ./server'
                }
            }
        }
        stage('Login to Docker Hub') {
            steps {
                script {
                    // Login to Docker Hub using Jenkins credentials securely
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        // Use the credentials from Jenkins to login to Docker Hub
                        sh "echo ${DOCKER_PASSWORD} | docker login -u ${DOCKER_USERNAME} --password-stdin"
                    }
                }
            }
        }
        stage('Tag Docker Images') {
            steps {
                script {
                    // Tag images with the Docker Hub repository names
                    sh 'docker tag my-frontend ${DOCKER_HUB_REPO_FRONTEND}:latest'
                    sh 'docker tag my-backend ${DOCKER_HUB_REPO_BACKEND}:latest'
                }
            }
        }
        stage('Push Docker Images to Docker Hub') {
            steps {
                script {
                    // Push the Docker images to Docker Hub
                    sh 'docker push ${DOCKER_HUB_REPO_FRONTEND}:latest'
                    sh 'docker push ${DOCKER_HUB_REPO_BACKEND}:latest'
                }
            }
        }
        stage('Run Docker Containers') {
            steps {
                script {
                    echo 'Starting frontend and backend Docker containers...'
                    sh 'docker run -d -p 3000:3000 --name frontend my-frontend'
                    sh 'docker run -d -p 5000:5000 --name backend my-backend'
                    sleep 10
                }
            }
        }
        stage('Health Check - Frontend') {
            steps {
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
            echo 'Web app is up and running!'
        }
        failure {
            echo 'Web app is not up, please check the logs.'
        }
        always {
            echo 'Cleaning up...'
            script {
                try {
                    sh 'docker stop frontend || true'
                    sh 'docker stop backend || true'
                    sh 'docker rm frontend || true'
                    sh 'docker rm backend || true'
                } catch (e) {
                    echo "Cleanup failed: ${e.getMessage()}"
                }
            }
        }
    }
}
