import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_documents_category" AS ENUM('constitution', 'regulations-policies', 'circulars', 'annual-reports', 'strategic-plans');
  CREATE TYPE "public"."enum_downloads_category" AS ENUM('club', 'player', 'coach-arbiter', 'other');
  CREATE TYPE "public"."enum_downloads_kind" AS ENUM('file', 'link');
  CREATE TABLE "documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"category" "enum_documents_category" NOT NULL,
  	"document_date" timestamp(3) with time zone NOT NULL,
  	"description" varchar,
  	"prefix" varchar DEFAULT '',
  	"_objectkey" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "downloads" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"category" "enum_downloads_category" NOT NULL,
  	"description" varchar,
  	"kind" "enum_downloads_kind" DEFAULT 'file' NOT NULL,
  	"file_id" integer,
  	"url" varchar,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "documents_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "downloads_id" integer;
  ALTER TABLE "downloads" ADD CONSTRAINT "downloads_file_id_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."files"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "documents_title_idx" ON "documents" USING btree ("title");
  CREATE INDEX "documents_category_idx" ON "documents" USING btree ("category");
  CREATE INDEX "documents_document_date_idx" ON "documents" USING btree ("document_date");
  CREATE INDEX "documents_updated_at_idx" ON "documents" USING btree ("updated_at");
  CREATE INDEX "documents_created_at_idx" ON "documents" USING btree ("created_at");
  CREATE UNIQUE INDEX "documents_filename_idx" ON "documents" USING btree ("filename");
  CREATE INDEX "downloads_file_idx" ON "downloads" USING btree ("file_id");
  CREATE INDEX "downloads_updated_at_idx" ON "downloads" USING btree ("updated_at");
  CREATE INDEX "downloads_created_at_idx" ON "downloads" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_documents_fk" FOREIGN KEY ("documents_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_downloads_fk" FOREIGN KEY ("downloads_id") REFERENCES "public"."downloads"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_documents_id_idx" ON "payload_locked_documents_rels" USING btree ("documents_id");
  CREATE INDEX "payload_locked_documents_rels_downloads_id_idx" ON "payload_locked_documents_rels" USING btree ("downloads_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "documents" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "downloads" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "documents" CASCADE;
  DROP TABLE "downloads" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_documents_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_downloads_fk";
  
  DROP INDEX "payload_locked_documents_rels_documents_id_idx";
  DROP INDEX "payload_locked_documents_rels_downloads_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "documents_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "downloads_id";
  DROP TYPE "public"."enum_documents_category";
  DROP TYPE "public"."enum_downloads_category";
  DROP TYPE "public"."enum_downloads_kind";`)
}
