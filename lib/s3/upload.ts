import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import { s3Client } from './config';

export interface UploadParams {
    file: File;
    contentType: string;
}

export async function generatePresignedUrl(contentType: string): Promise<{
    uploadUrl: string;
    publicUrl: string;
    key: string;
}> {
    if (!process.env.DO_SPACES_BUCKET) {
        throw new Error('DO_SPACES_BUCKET is not configured');
    }

    const key = `uploads/${uuidv4()}`;
    const command = new PutObjectCommand({
        Bucket: process.env.DO_SPACES_BUCKET,
        Key: key,
        ContentType: contentType,
        ACL: 'public-read',
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    const publicUrl = `https://${process.env.DO_SPACES_BUCKET}.${process.env.DO_SPACES_ENDPOINT}/${key}`;

    return {
        uploadUrl,
        publicUrl,
        key,
    };
}

export async function deleteImage(key: string): Promise<void> {
    if (!process.env.DO_SPACES_BUCKET) {
        throw new Error('DO_SPACES_BUCKET is not configured');
    }

    const command = new DeleteObjectCommand({
        Bucket: process.env.DO_SPACES_BUCKET,
        Key: key,
    });

    await s3Client.send(command);
}