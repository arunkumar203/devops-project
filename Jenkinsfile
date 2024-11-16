pipeline {
    agent any
    
    environment {
        DOCKER_HUB_CREDS = credentials('docker-hub-credentials')
        DOCKER_USERNAME = 'sarankumar2727'
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/arunkumar203/devops-project'
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
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh 'echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin'
                    }
                }
            }
        }
        
        stage('Tag Docker Images') {
            steps {
                script {
                    sh "docker tag my-frontend ${env.DOCKER_USERNAME}/my-frontend:latest"
                    sh "docker tag my-backend ${env.DOCKER_USERNAME}/my-backend:latest"
                }
            }
        }
        
        stage('Push Docker Images to Docker Hub') {
            steps {
                script {
                    sh "docker push ${env.DOCKER_USERNAME}/my-frontend:latest"
                    sh "docker push ${env.DOCKER_USERNAME}/my-backend:latest"
                }
            }
        }
        
        stage('Run Docker Containers') {
            steps {
                script {
                    sh """
                        docker run -d -p 3000:3000 --name frontend ${env.DOCKER_USERNAME}/my-frontend:latest
                        docker run -d -p 5000:5000 --name backend ${env.DOCKER_USERNAME}/my-backend:latest
                    """
                }
            }
        }
        
        stage('Health Check - Frontend') {
            steps {
                script {
                    sh 'sleep 30' // Wait for containers to start
                    sh 'curl -f http://localhost:3000 || exit 1'
                }
            }
        }
        
        stage('Health Check - Backend') {
            steps {
                script {
                    sh 'curl -f http://localhost:5000/api/health || exit 1'
                }
            }
        }
    }
    
    post {
        always {
            echo 'Cleaning up...'
            script {
                sh 'docker stop frontend || true'
                sh 'docker stop backend || true'
                sh 'docker rm frontend || true'
                sh 'docker rm backend || true'
            }
        }
        success {
            echo 'Web app is up and running!'
        }
        failure {
            echo 'Web app is not up, please check the logs.'
        }
    }
}
