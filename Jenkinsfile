pipeline {
    agent any

    environment {
        EC2_HOST = "13.125.91.203"
        EC2_USER = "ec2-user"
        APP_DIR  = "/home/ec2-user/front/front"
    }

    stages {
        stage('Checkout') {
            steps {
                // Git 소스 코드 체크아웃 (Jenkins 워크스페이스에 저장)
                checkout scm
                script {
                    // 현재 커밋 정보 로그
                    def gitCommit = sh(returnStdout: true, script: 'git rev-parse HEAD').trim()
                    def gitBranch = sh(returnStdout: true, script: 'git rev-parse --abbrev-ref HEAD').trim()
                    echo "Building branch: ${gitBranch}"
                    echo "Commit: ${gitCommit}"
                }
            }
        }

        stage('Deploy Frontend to EC2') {
            steps {
                withCredentials([
                    sshUserPrivateKey(
                        credentialsId: 'ec2-frontend-ssh',
                        keyFileVariable: 'SSH_KEY'
                    )
                ]) {
                    bat '''
                    echo ========================================
                    echo Starting deployment to EC2...
                    echo ========================================
                    
                    echo Fix SSH key permissions...
                    icacls "%SSH_KEY%" /inheritance:r
                    icacls "%SSH_KEY%" /grant:r "SYSTEM:R"
                    
                    echo Connecting to EC2 server...
                    ssh -i "%SSH_KEY%" -o StrictHostKeyChecking=no %EC2_USER%@%EC2_HOST% ^
                    "cd %APP_DIR% && \
                     echo 'Current directory:' && pwd && \
                     echo 'Git pull...' && git pull origin main && \
                     echo 'Installing dependencies...' && npm install && \
                     echo 'Building application...' && npm run build && \
                     echo 'Reloading nginx...' && sudo systemctl reload nginx && \
                     echo 'Deployment completed successfully!'"
                    
                    echo ========================================
                    echo Deployment finished
                    echo ========================================
                    '''
                }
            }
        }
    }

    post {
        always {
            // 빌드 후 항상 실행 (성공/실패 무관)
            echo "Build completed with status: ${currentBuild.currentResult}"
        }
        success {
            // 빌드 성공 시
            echo "🥵🥵🥵🥵 Deployment successful!"
        }
        failure {
            // 빌드 실패 시
            echo "🤬🤬🤬🤬 Deployment failed!"
            // 필요시 이메일 알림 등 추가 가능
        }
    }
}