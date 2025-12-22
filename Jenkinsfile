pipeline {
    agent any

    environment {
        PROJECT_DIR = "/home/ec2-user/front/front"
        NODE_ENV = "production"
    }

    stages {

        stage('Checkout') {
            steps {
                echo "📦 Checkout source code"
                dir("${PROJECT_DIR}") {
                    git branch: 'main',
                        url: 'https://github.com/Dropz-to-a/front.git'
                }
            }
        }

        stage('Node Version Check') {
            steps {
                sh 'node -v'
                sh 'npm -v'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo "📥 Install dependencies"
                dir("${PROJECT_DIR}") {
                    sh 'npm ci'
                }
            }
        }

        stage('Build') {
            steps {
                echo "🏗️ Build frontend"
                dir("${PROJECT_DIR}") {
                    sh 'npm run build'
                }
            }
        }

        stage('Reload Nginx') {
            steps {
                echo "🔄 Reload nginx"
                sh 'sudo systemctl reload nginx'
            }
        }
    }

    post {
        success {
            echo "✅ Frontend deployment SUCCESS"
        }
        failure {
            echo "❌ Frontend deployment FAILED"
        }
    }
}
