"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
// import { TipTapEditor } from "@/components/editor/tiptap-editor";
import { ImageUpload } from "@/components/posts/image-upload";
import { Category } from "@prisma/client";
import { postSchema } from "@/lib/validations/post";
import { useToast } from "@/hooks/use-toast";
import { usePosts } from "@/hooks/use-posts";
import { Textarea } from "@/components/ui/textarea";
// import { PlusIcon, Trash2 } from "lucide-react";

export default function PostForm() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const { createPost, updatePost, getPost } = usePosts();
  const isEditing = params.action !== "create";

  type FormValues = {
    title: string;
    excerpt: string;
    content: string;
    image: string | undefined;
    category: Category;
    published: boolean;
  };

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
      title: "",
      excerpt: "",
      content: "",
      image: undefined,
      category: "WELL_BEING" as Category,
      published: false,
    },
  });

  const [loading, setLoading] = useState(false);
  // const [additems, setadditems] = useState<string[]>([""]);

  // const addInput = () => {
  //   setadditems([...additems, ""]);
  // };

  // const removeInput = (index: number) => {
  //   setadditems(additems.filter((_, i) => i !== index));
  // };

  // const handleInputChange = (index: number, value: string) => {
  //   const newInputs = [...additems];
  //   newInputs[index] = value;
  //   setadditems(newInputs);
  // };

  const fetchPost = async () => {
    const post = await getPost(params.action as string);
    if (post) {
      reset({
        ...post,
        image: post.image,
      });
    }
  };

  useEffect(() => {
    if (isEditing) {
      fetchPost();
    }
  }, [isEditing]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      if (isEditing) {
        await updatePost(params.action as string, data);
        toast({
          title: "Success",
          description: "Post updated successfully",
        });
      } else {
        await createPost(data);
        toast({
          title: "Success",
          description: "Post created successfully",
        });
      }
      router.push("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "create"} post`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const categories = Object.values(Category);
  const currentCategory = watch("category");
  const isPublished = watch("published");

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {isEditing ? "Edit Post" : "Create New Post"}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            {...register("title")}
            placeholder="Enter post title"
            className="w-full"
          />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-4">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea
            id="excerpt"
            {...register("excerpt")}
            placeholder="Enter a brief summary of your post..."
            className="w-full h-24 resize-none"
          />
          {errors.excerpt && (
            <p className="text-sm text-destructive">{errors.excerpt.message}</p>
          )}
        </div>

        <div className="space-y-4">
          <Label htmlFor="category">Category</Label>
          <Select
            value={currentCategory}
            onValueChange={(value: Category) => setValue("category", value)}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.replace("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <Label>Featured Image</Label>
          <ImageUpload onUploadComplete={(url) => setValue("image", url)} />
        </div>

        <div className="space-y-4">
          <Label>Content</Label>
          {/* <TipTapEditor
            content={watch("content")}
            onChange={(value) => setValue("content", value)}
          /> */}
          <Textarea
            id="excerpt"
            {...register("content")}
            placeholder="Enter content as HTML format..."
            className="w-full h-48 resize-none"
          />
          {errors.content && (
            <p className="text-sm text-destructive">{errors.content.message}</p>
          )}
        </div>

        {/* <div className="space-y-4">
          <Label>Section</Label>
          {additems.map((input, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                value={input}
                onChange={(e) => handleInputChange(index, e.target.value)}
                placeholder={`section ${index + 1}`}
                className="w-full"
              />
              <Button
                variant="outline"
                size="default"
                onClick={() => removeInput(index)}
                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="default"
            onClick={addInput}
            className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            <PlusIcon className="w-4 h-4" />
          </Button>
        </div> */}

        <div className="flex items-center space-x-2">
          <Switch
            id="published"
            checked={isPublished}
            onCheckedChange={(checked) => setValue("published", checked)}
          />
          <Label htmlFor="published">
            {isPublished ? "Published" : "Draft"}
          </Label>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className={`bg-indigo-600 hover:bg-indigo-700 text-white ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={loading}
          >
            {loading ? "Loading..." : (isEditing ? "Update Post" : "Create Post")}
          </Button>
        </div>
      </form>
    </div>
  );
}
