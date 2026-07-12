import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Upload is only allowed in local development mode" }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const overwritePath = req.nextUrl.searchParams.get("overwritePath");
    let filePath: string;
    let relativeUrl: string;

    if (overwritePath) {
      // Sanitize overwritePath to prevent directory traversal
      const safePath = path.normalize(overwritePath).replace(/^(\.\.(\/|\\))+/, '').replace(/\\/g, '/');
      if (!safePath.startsWith("/bouquets/") && !safePath.startsWith("/flowers/")) {
        return NextResponse.json({ error: "Invalid overwrite path" }, { status: 400 });
      }
      // Strip leading slash for path joining
      const cleanPath = safePath.startsWith("/") ? safePath.slice(1) : safePath;
      filePath = path.join(process.cwd(), "public", cleanPath);
      relativeUrl = safePath.startsWith("/") ? safePath : `/${safePath}`;
    } else {
      // Get the type parameter (either 'bouquet' or 'flower')
      const type = req.nextUrl.searchParams.get("type") || "bouquet";
      const subDir = type === "flower" ? "flowers" : "bouquets";
      const useOriginalName = req.nextUrl.searchParams.get("useOriginalName") === "true";

      // Determine target directory inside public folder
      const uploadDir = path.join(process.cwd(), "public", subDir);
      
      // Ensure the folder exists
      await fs.mkdir(uploadDir, { recursive: true });

      // Generate a unique filename or use original name
      const originalName = file.name || "upload";
      const ext = path.extname(originalName) || ".png";
      const baseName = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
      
      const fileName = useOriginalName ? `${baseName}${ext}` : `${baseName}_${Date.now()}${ext}`;

      filePath = path.join(uploadDir, fileName);
      relativeUrl = `/${subDir}/${fileName}`;
    }

    // Read file buffer and save locally
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    await fs.writeFile(filePath, buffer);

    return NextResponse.json({ url: relativeUrl });
  } catch (error: any) {
    console.error("Local upload/overwrite error:", error);
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
  }
}
