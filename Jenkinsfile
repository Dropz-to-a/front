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
                checkout scm
                script {
                    try {
                        def gitCommit = bat(
                            script: '@echo off && git rev-parse HEAD',
                            returnStdout: true
                        ).trim()
                        
                        def gitBranch = bat(
                            script: '@echo off && git rev-parse --abbrev-ref HEAD',
                            returnStdout: true
                        ).trim()

                        echo "Building branch: ${gitBranch}"
                        echo "Commit: ${gitCommit}"
                    } catch (Exception e) {
                        echo "Warning: Could not get git information: ${e.getMessage()}"
                    }
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
                    script {
                        def ec2Host = "${EC2_HOST}"
                        def ec2User = "${EC2_USER}"
                        def appDir = "${APP_DIR}"
                        
                        // SSH 명령어를 세미콜론으로 연결하여 한 줄로 구성
                        def deployCommand = "cd ${appDir} && echo 'Current directory:' && pwd && echo 'Git pull...' && git pull origin main && echo 'Installing dependencies...' && npm install && echo 'Building application...' && npm run build && echo 'Restarting nginx...' && sudo systemctl restart nginx && echo 'Deployment completed successfully!'"
                        
                        // SSH_KEY는 bat 블록 내에서 직접 참조 (보안 변수 보간 경고 방지)
                        bat """
                            @echo off
                            setlocal enabledelayedexpansion
                            echo ========================================
                            echo Starting deployment to EC2...
                            echo ========================================
                            
                            echo Fix SSH key permissions...
                            icacls "%SSH_KEY%" /inheritance:r
                            icacls "%SSH_KEY%" /grant:r "SYSTEM:R"
                            
                            if errorlevel 1 (
                                echo Failed to set SSH key permissions
                                exit /b 1
                            )
                            
                            echo Connecting to EC2 server...
                            ssh -i "%SSH_KEY%" -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null ${ec2User}@${ec2Host} "${deployCommand}"
                            
                            if errorlevel 1 (
                                echo SSH command failed
                                exit /b 1
                            )
                            
                            echo ========================================
                            echo Deployment finished
                            echo ========================================
                        """
                    }
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