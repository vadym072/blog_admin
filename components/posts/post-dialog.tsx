'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { postSchema } from '@/lib/validations/post';
import type { Post } from '@prisma/client';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageUpload } from './image-upload';
import { Category } from '@prisma/client';

type FormValues = {
    title: string;
    content: string;
    image?: string;
    category: Category;
    published: boolean;
};

interface PostDialogProps {
    post?: Post;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: any) => Promise<void>;
}

export function PostDialog({ post, open, onOpenChange, onSubmit }: PostDialogProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        reset,
    } = useForm<FormValues>({
        resolver: zodResolver(postSchema),
        defaultValues: {
            title: '',
            content: '',
            image: undefined,
            category: 'WELL_BEING' as Category,
            published: false,
        },
    });

    // Reset form when post changes or dialog opens
    useEffect(() => {
        if (open) {
            reset(post ? {
                ...post,
                image: post.image || undefined,
            } : {
                title: '',
                content: '',
                image: undefined,
                category: 'WELL_BEING' as Category,
                published: false,
            });
        }
    }, [open, post, reset]);

    const onSubmitForm = async (data: any) => {
        try {
            await onSubmit(data);
            onOpenChange(false);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const categories = Object.values(Category);
    const currentCategory = watch('category');
    const isPublished = watch('published');

    return (
        <AnimatePresence>
            {open && (
                <Dialog open={open} onOpenChange={onOpenChange}>
                    <DialogContent className="sm:max-w-[600px]">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.2 }}
                        >
                            <DialogHeader>
                                <DialogTitle className="text-xl font-semibold">
                                    {post ? 'Edit Post' : 'Create Post'}
                                </DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6 mt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        {...register('title')}
                                        placeholder="Enter post title"
                                        className="w-full"
                                    />
                                    {errors.title && (
                                        <p className="text-sm text-destructive">{errors.title.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Select
                                        value={currentCategory}
                                        onValueChange={(value: Category) => setValue('category', value)}
                                    >
                                        <SelectTrigger id="category">
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category} value={category}>
                                                    {category.replace('_', ' ')}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.category && (
                                        <p className="text-sm text-destructive">{errors.category.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="content">Content</Label>
                                    <Textarea
                                        id="content"
                                        {...register('content')}
                                        placeholder="Write your post content here..."
                                        className="min-h-[100px] w-full resize-y"
                                    />
                                    {errors.content && (
                                        <p className="text-sm text-destructive">{errors.content.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <ImageUpload onUploadComplete={(url) => setValue('image', url)} />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="published"
                                        checked={isPublished}
                                        onCheckedChange={(checked) => setValue('published', checked)}
                                    />
                                    <Label htmlFor="published">
                                        {isPublished ? 'Published' : 'Draft'}
                                    </Label>
                                </div>

                                <div className="flex justify-end space-x-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => onOpenChange(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        type="submit"
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                    >
                                        {post ? 'Update Post' : 'Create Post'}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </DialogContent>
                </Dialog>
            )}
        </AnimatePresence>
    );
}