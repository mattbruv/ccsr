import { useEffect, useState } from 'react';
import { Dropzone, FileWithPath } from '@mantine/dropzone';
import { Text, Group, rem } from '@mantine/core';
import { IconPhoto } from '@tabler/icons-react';


type ImageUploaderProps = {
    onImageUpload: (file: File) => void
}

function ImageUploader({ onImageUpload }: ImageUploaderProps) {

    // Handle file upload
    const handleFileDrop = (files: FileWithPath[]) => {
        if (files.length > 0) {
            const file = files[0];
            onImageUpload(file);
        }
    };

    // Handle clipboard paste
    const handlePaste = (event: ClipboardEvent) => {
        if (!event.clipboardData) return;
        const items = event.clipboardData.items;
        for (const item of items) {
            if (item.type.startsWith('image/')) {
                const blob = item.getAsFile();
                if (blob) {
                    onImageUpload(blob);
                }
            }
        }
    };

    // Attach paste event listener to window
    useEffect(() => {
        window.addEventListener('paste', handlePaste);
        return () => window.removeEventListener('paste', handlePaste);
    }, []);

    return (
        <div>
            <Dropzone onDrop={handleFileDrop} accept={["image/png"]}>
                <Group justify="center" gap="xl" style={{ pointerEvents: 'none' }}>
                    <Dropzone.Idle>
                        <IconPhoto
                            style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }}
                            stroke={1.5}
                        />
                    </Dropzone.Idle>
                    <div>
                        <Text size="xl" inline>
                            Drag image here or click to select a PNG file
                        </Text>
                    </div>
                </Group>
            </Dropzone>
            <Group mt="md">
                <p>Or paste an image directly from your clipboard</p>
            </Group>
        </div>
    );
}

export default ImageUploader;
