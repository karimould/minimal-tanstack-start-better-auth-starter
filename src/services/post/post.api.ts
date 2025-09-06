import { createServerFn, json } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import { auth } from "~/utils/auth/auth";
import { db } from "~/utils/db";
import { post } from "~/utils/db/schema";
import { eq, desc } from "drizzle-orm";
import {
  CreatePostSchema,
  UpdatePostSchema,
  DeletePostSchema,
  GetPostSchema,
} from "./post.schema";
import { userRequiredMiddleware } from "../auth/auth.api";

export const createPost = createServerFn({ method: "POST" })
  .middleware([userRequiredMiddleware])
  .validator(CreatePostSchema)
  .handler(async ({ data, context: { userSession } }) => {
    const [newPost] = await db
      .insert(post)
      .values({
        title: data.title,
        content: data.content,
        authorId: userSession.user.id,
      })
      .returning();

    return newPost;
  });

export const getPosts = createServerFn({ method: "GET" }).handler(async () => {
  const posts = await db
    .select({
      id: post.id,
      title: post.title,
      content: post.content,
      authorId: post.authorId,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    })
    .from(post)
    .orderBy(desc(post.createdAt));

  return posts;
});

export const getPost = createServerFn({ method: "GET" })
  .validator(GetPostSchema)
  .handler(async ({ data }) => {
    const [foundPost] = await db
      .select()
      .from(post)
      .where(eq(post.id, data.id))
      .limit(1);

    if (!foundPost) {
      throw json({ message: "Post not found" }, { status: 404 });
    }

    return foundPost;
  });

export const updatePost = createServerFn({ method: "POST" })
  .middleware([userRequiredMiddleware])
  .validator(UpdatePostSchema)
  .handler(async ({ data, context: { userSession } }) => {
    const user = userSession.user;

    const [existingPost] = await db
      .select()
      .from(post)
      .where(eq(post.id, data.id))
      .limit(1);

    if (!existingPost) {
      throw json({ message: "Post not found" }, { status: 404 });
    }

    if (existingPost.authorId !== user.id) {
      throw json(
        { message: "You can only update your own posts" },
        { status: 403 }
      );
    }

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (data.title !== undefined) updateData.title = data.title;
    if (data.content !== undefined) updateData.content = data.content;

    const [updatedPost] = await db
      .update(post)
      .set(updateData)
      .where(eq(post.id, data.id))
      .returning();

    return updatedPost;
  });

export const deletePost = createServerFn({ method: "POST" })
  .middleware([userRequiredMiddleware])
  .validator(DeletePostSchema)
  .handler(async ({ data, context: { userSession } }) => {
    const user = userSession.user;

    const [existingPost] = await db
      .select()
      .from(post)
      .where(eq(post.id, data.id))
      .limit(1);

    if (!existingPost) {
      throw json({ message: "Post not found" }, { status: 404 });
    }

    if (existingPost.authorId !== user.id) {
      throw json(
        { message: "You can only delete your own posts" },
        { status: 403 }
      );
    }

    await db.delete(post).where(eq(post.id, data.id));

    return { success: true, message: "Post deleted successfully" };
  });

export const getUserPosts = createServerFn({ method: "GET" })
  .middleware([userRequiredMiddleware])
  .handler(async ({ context: { userSession } }) => {
    const user = userSession.user;

    const userPosts = await db
      .select()
      .from(post)
      .where(eq(post.authorId, user.id))
      .orderBy(desc(post.createdAt));

    return userPosts;
  });
