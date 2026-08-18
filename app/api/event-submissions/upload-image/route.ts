import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const BUCKET_NAME = "event-images";
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const EXTENSION_BY_MIME_TYPE: Record<string, string> = {
  "image/gif": "gif",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

type StorageErrorLike = {
  message?: string;
  name?: string;
  statusCode?: number | string;
};

type StorageBucketApi = {
  getBucket: (id: string) => Promise<{ error: StorageErrorLike | null }>;
  createBucket: (
    id: string,
    options: {
      allowedMimeTypes: string[];
      fileSizeLimit: number;
      public: boolean;
    }
  ) => Promise<{ error: StorageErrorLike | null }>;
};

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!isFileLike(file)) {
      return NextResponse.json(
        { error: "Envie um arquivo de imagem." },
        { status: 400 }
      );
    }

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Envie uma imagem JPG, PNG, WEBP ou GIF." },
        { status: 400 }
      );
    }

    if (file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        { error: "A imagem precisa ter no máximo 5 MB." },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: "Configuração do Supabase ausente no servidor." },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    await ensureEventImagesBucket(supabase.storage);

    const extension = getImageExtension(file);
    const filePath = `submissions/${Date.now()}-${randomUUID()}.${extension}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, buffer, {
        cacheControl: "3600",
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Erro no upload da imagem:", uploadError);

      return NextResponse.json(
        { error: "Erro ao enviar imagem para o Supabase." },
        { status: 500 }
      );
    }

    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      path: filePath,
      publicUrl: data.publicUrl,
    });
  } catch (error) {
    console.error("Erro geral upload-image:", error);

    return NextResponse.json(
      { error: "Erro ao fazer upload da imagem." },
      { status: 500 }
    );
  }
}

async function ensureEventImagesBucket(storage: StorageBucketApi) {
  const { error } = await storage.getBucket(BUCKET_NAME);

  if (!error) {
    return;
  }

  if (!isMissingBucketError(error)) {
    throw error;
  }

  const { error: createError } = await storage.createBucket(BUCKET_NAME, {
    allowedMimeTypes: Array.from(ALLOWED_IMAGE_TYPES),
    fileSizeLimit: MAX_IMAGE_BYTES,
    public: true,
  });

  if (createError && !isExistingBucketError(createError)) {
    throw createError;
  }
}

function isMissingBucketError(error: StorageErrorLike) {
  const message = error.message?.toLowerCase() || "";
  const statusCode = String(error.statusCode || "");

  return (
    statusCode === "404" ||
    message.includes("not found") ||
    message.includes("does not exist")
  );
}

function isExistingBucketError(error: StorageErrorLike) {
  const message = error.message?.toLowerCase() || "";
  const statusCode = String(error.statusCode || "");

  return (
    statusCode === "409" ||
    message.includes("already exists") ||
    message.includes("already exist")
  );
}

function isFileLike(value: FormDataEntryValue | null): value is File {
  return value instanceof File;
}

function getImageExtension(file: File) {
  const extensionFromType = EXTENSION_BY_MIME_TYPE[file.type];

  if (extensionFromType) {
    return extensionFromType;
  }

  const extensionFromName = file.name.split(".").pop()?.toLowerCase();

  return extensionFromName?.replace(/[^a-z0-9]/g, "") || "png";
}
