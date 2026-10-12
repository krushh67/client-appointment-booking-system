# Deploys backend + frontend to Docker Desktop Kubernetes.
# Run from the project folder:  powershell -ExecutionPolicy Bypass -File .\deploy.ps1
$ErrorActionPreference = "Stop"

Write-Host "== 1. Use Docker Desktop cluster" -ForegroundColor Cyan
kubectl config use-context docker-desktop

Write-Host "== 2. Build images" -ForegroundColor Cyan
docker build -t appointment-booking-api:latest .
docker build --no-cache -t appointment-booking-frontend:v2 ./frontend

Write-Host "== 3. Recreate services (clean LoadBalancer/ClusterIP setup)" -ForegroundColor Cyan
kubectl delete svc appointment-booking-service appointment-booking-frontend-service --ignore-not-found
kubectl apply -f k8s/
kubectl set image deployment/appointment-booking-frontend appointment-booking-frontend=appointment-booking-frontend:v2

Write-Host "== 4. Restart pods with new images" -ForegroundColor Cyan
kubectl rollout restart deployment/appointment-booking-api
kubectl rollout restart deployment/appointment-booking-frontend
kubectl rollout status deployment/appointment-booking-api
kubectl rollout status deployment/appointment-booking-frontend

Write-Host "== 5. Check API route through frontend nginx (expect {""status"":""ok""...})" -ForegroundColor Cyan
kubectl exec deploy/appointment-booking-frontend -- wget -qO- http://127.0.0.1/api/

Write-Host "== 6. Status" -ForegroundColor Cyan
kubectl get pods
kubectl get svc

Write-Host "Done. Open http://localhost/ (or http://localhost:8181 after running the port-forward below)." -ForegroundColor Green
Write-Host "Port-forward: kubectl port-forward svc/appointment-booking-frontend-service 8181:80"
