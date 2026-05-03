CREATE TABLE "url_mappings" (
  "id" TEXT NOT NULL,
  "short_code" TEXT NOT NULL,
  "original_url" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "url_mappings_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "url_mappings_short_code_key" ON "url_mappings"("short_code");
