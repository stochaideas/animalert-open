#!/usr/bin/env bash
set -eo pipefail

BUCKET_NAME="${AWS_S3_BUCKET_NAME:-animalert-bucket}"
BUCKET_NAME_PDF="${AWS_S3_PDF_BUCKET_NAME:-animalert-pdfs}"

echo "Creating S3 bucket: ${BUCKET_NAME}"

awslocal s3 mb "s3://${BUCKET_NAME}" 2>/dev/null || true

echo "Creating S3 bucket: ${BUCKET_NAME_PDF}"

awslocal s3 mb "s3://${BUCKET_NAME_PDF}" 2>/dev/null || true

echo "Configuring CORS for bucket: ${BUCKET_NAME}"

awslocal s3api put-bucket-cors \
  --bucket "${BUCKET_NAME}" \
  --cors-configuration '{
    "CORSRules": [
      {
        "AllowedOrigins": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "HEAD"],
        "AllowedHeaders": ["*"],
        "ExposeHeaders": ["ETag"]
      }
    ]
  }'

echo "Configuring CORS for bucket: ${BUCKET_NAME_PDF}"

awslocal s3api put-bucket-cors \
  --bucket "${BUCKET_NAME_PDF}" \
  --cors-configuration '{
    "CORSRules": [
      {
        "AllowedOrigins": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "HEAD"],
        "AllowedHeaders": ["*"],
        "ExposeHeaders": ["ETag"]
      }
    ]
  }'

echo "Current buckets:"
awslocal s3 ls
