import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_section" AS ENUM('education');
  CREATE TYPE "public"."enum__pages_v_version_section" AS ENUM('education');
  CREATE TYPE "public"."enum_clubs_socials_platform" AS ENUM('facebook', 'instagram', 'youtube', 'x', 'tiktok', 'other');
  CREATE TYPE "public"."enum_clubs_registration" AS ENUM('active', 'lapsed');
  CREATE TYPE "public"."enum_clubs_district" AS ENUM('ampara', 'anuradhapura', 'badulla', 'batticaloa', 'colombo', 'galle', 'gampaha', 'hambantota', 'jaffna', 'kalutara', 'kandy', 'kegalle', 'kilinochchi', 'kurunegala', 'mannar', 'matale', 'matara', 'monaragala', 'mullaitivu', 'nuwara-eliya', 'polonnaruwa', 'puttalam', 'ratnapura', 'trincomalee', 'vavuniya');
  CREATE TYPE "public"."enum_clubs_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__clubs_v_version_socials_platform" AS ENUM('facebook', 'instagram', 'youtube', 'x', 'tiktok', 'other');
  CREATE TYPE "public"."enum__clubs_v_version_registration" AS ENUM('active', 'lapsed');
  CREATE TYPE "public"."enum__clubs_v_version_district" AS ENUM('ampara', 'anuradhapura', 'badulla', 'batticaloa', 'colombo', 'galle', 'gampaha', 'hambantota', 'jaffna', 'kalutara', 'kandy', 'kegalle', 'kilinochchi', 'kurunegala', 'mannar', 'matale', 'matara', 'monaragala', 'mullaitivu', 'nuwara-eliya', 'polonnaruwa', 'puttalam', 'ratnapura', 'trincomalee', 'vavuniya');
  CREATE TYPE "public"."enum__clubs_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_galleries_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__galleries_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_brand_assets_category" AS ENUM('logo', 'guidelines', 'template', 'other');
  ALTER TYPE "public"."enum_news_category" ADD VALUE 'stories';
  ALTER TYPE "public"."enum_news_category" ADD VALUE 'press-releases';
  ALTER TYPE "public"."enum__news_v_version_category" ADD VALUE 'stories';
  ALTER TYPE "public"."enum__news_v_version_category" ADD VALUE 'press-releases';
  CREATE TABLE "videos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"poster_id" integer,
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
  
  CREATE TABLE "clubs_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_clubs_socials_platform",
  	"url" varchar
  );
  
  CREATE TABLE "clubs_contacts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" varchar,
  	"phone" varchar,
  	"email" varchar,
  	"public" boolean DEFAULT false
  );
  
  CREATE TABLE "clubs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"slug" varchar,
  	"registration" "enum_clubs_registration" DEFAULT 'active',
  	"last_renewed" numeric,
  	"logo_id" integer,
  	"district" "enum_clubs_district",
  	"city" varchar,
  	"founded" numeric,
  	"description" varchar,
  	"address" varchar,
  	"map_url" varchar,
  	"website" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_clubs_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_clubs_v_version_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"platform" "enum__clubs_v_version_socials_platform",
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_clubs_v_version_contacts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" varchar,
  	"phone" varchar,
  	"email" varchar,
  	"public" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_clubs_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_registration" "enum__clubs_v_version_registration" DEFAULT 'active',
  	"version_last_renewed" numeric,
  	"version_logo_id" integer,
  	"version_district" "enum__clubs_v_version_district",
  	"version_city" varchar,
  	"version_founded" numeric,
  	"version_description" varchar,
  	"version_address" varchar,
  	"version_map_url" varchar,
  	"version_website" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__clubs_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "galleries_blocks_photo" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "galleries_blocks_video_embed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"caption" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "galleries_blocks_video_file" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"video_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "galleries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"date" timestamp(3) with time zone,
  	"event_id" integer,
  	"cover_id" integer,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_galleries_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_galleries_v_blocks_photo" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_galleries_v_blocks_video_embed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"caption" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_galleries_v_blocks_video_file" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"video_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_galleries_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_date" timestamp(3) with time zone,
  	"version_event_id" integer,
  	"version_cover_id" integer,
  	"version_description" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__galleries_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "brand_assets" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"category" "enum_brand_assets_category" DEFAULT 'logo' NOT NULL,
  	"description" varchar,
  	"order" numeric DEFAULT 0,
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
  
  ALTER TABLE "pages" ADD COLUMN "section" "enum_pages_section";
  ALTER TABLE "pages" ADD COLUMN "summary" varchar;
  ALTER TABLE "pages" ADD COLUMN "order" numeric DEFAULT 0;
  ALTER TABLE "_pages_v" ADD COLUMN "version_section" "enum__pages_v_version_section";
  ALTER TABLE "_pages_v" ADD COLUMN "version_summary" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_order" numeric DEFAULT 0;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "videos_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "clubs_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "galleries_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "brand_assets_id" integer;
  ALTER TABLE "videos" ADD CONSTRAINT "videos_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "clubs_socials" ADD CONSTRAINT "clubs_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."clubs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "clubs_contacts" ADD CONSTRAINT "clubs_contacts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."clubs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "clubs" ADD CONSTRAINT "clubs_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_clubs_v_version_socials" ADD CONSTRAINT "_clubs_v_version_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_clubs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_clubs_v_version_contacts" ADD CONSTRAINT "_clubs_v_version_contacts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_clubs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_clubs_v" ADD CONSTRAINT "_clubs_v_parent_id_clubs_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."clubs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_clubs_v" ADD CONSTRAINT "_clubs_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "galleries_blocks_photo" ADD CONSTRAINT "galleries_blocks_photo_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "galleries_blocks_photo" ADD CONSTRAINT "galleries_blocks_photo_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."galleries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "galleries_blocks_video_embed" ADD CONSTRAINT "galleries_blocks_video_embed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."galleries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "galleries_blocks_video_file" ADD CONSTRAINT "galleries_blocks_video_file_video_id_videos_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."videos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "galleries_blocks_video_file" ADD CONSTRAINT "galleries_blocks_video_file_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."galleries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "galleries" ADD CONSTRAINT "galleries_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "galleries" ADD CONSTRAINT "galleries_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_galleries_v_blocks_photo" ADD CONSTRAINT "_galleries_v_blocks_photo_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_galleries_v_blocks_photo" ADD CONSTRAINT "_galleries_v_blocks_photo_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_galleries_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_galleries_v_blocks_video_embed" ADD CONSTRAINT "_galleries_v_blocks_video_embed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_galleries_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_galleries_v_blocks_video_file" ADD CONSTRAINT "_galleries_v_blocks_video_file_video_id_videos_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."videos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_galleries_v_blocks_video_file" ADD CONSTRAINT "_galleries_v_blocks_video_file_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_galleries_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_galleries_v" ADD CONSTRAINT "_galleries_v_parent_id_galleries_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."galleries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_galleries_v" ADD CONSTRAINT "_galleries_v_version_event_id_events_id_fk" FOREIGN KEY ("version_event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_galleries_v" ADD CONSTRAINT "_galleries_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "videos_poster_idx" ON "videos" USING btree ("poster_id");
  CREATE INDEX "videos_updated_at_idx" ON "videos" USING btree ("updated_at");
  CREATE INDEX "videos_created_at_idx" ON "videos" USING btree ("created_at");
  CREATE UNIQUE INDEX "videos_filename_idx" ON "videos" USING btree ("filename");
  CREATE INDEX "clubs_socials_order_idx" ON "clubs_socials" USING btree ("_order");
  CREATE INDEX "clubs_socials_parent_id_idx" ON "clubs_socials" USING btree ("_parent_id");
  CREATE INDEX "clubs_contacts_order_idx" ON "clubs_contacts" USING btree ("_order");
  CREATE INDEX "clubs_contacts_parent_id_idx" ON "clubs_contacts" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "clubs_slug_idx" ON "clubs" USING btree ("slug");
  CREATE INDEX "clubs_logo_idx" ON "clubs" USING btree ("logo_id");
  CREATE INDEX "clubs_updated_at_idx" ON "clubs" USING btree ("updated_at");
  CREATE INDEX "clubs_created_at_idx" ON "clubs" USING btree ("created_at");
  CREATE INDEX "clubs__status_idx" ON "clubs" USING btree ("_status");
  CREATE INDEX "_clubs_v_version_socials_order_idx" ON "_clubs_v_version_socials" USING btree ("_order");
  CREATE INDEX "_clubs_v_version_socials_parent_id_idx" ON "_clubs_v_version_socials" USING btree ("_parent_id");
  CREATE INDEX "_clubs_v_version_contacts_order_idx" ON "_clubs_v_version_contacts" USING btree ("_order");
  CREATE INDEX "_clubs_v_version_contacts_parent_id_idx" ON "_clubs_v_version_contacts" USING btree ("_parent_id");
  CREATE INDEX "_clubs_v_parent_idx" ON "_clubs_v" USING btree ("parent_id");
  CREATE INDEX "_clubs_v_version_version_slug_idx" ON "_clubs_v" USING btree ("version_slug");
  CREATE INDEX "_clubs_v_version_version_logo_idx" ON "_clubs_v" USING btree ("version_logo_id");
  CREATE INDEX "_clubs_v_version_version_updated_at_idx" ON "_clubs_v" USING btree ("version_updated_at");
  CREATE INDEX "_clubs_v_version_version_created_at_idx" ON "_clubs_v" USING btree ("version_created_at");
  CREATE INDEX "_clubs_v_version_version__status_idx" ON "_clubs_v" USING btree ("version__status");
  CREATE INDEX "_clubs_v_created_at_idx" ON "_clubs_v" USING btree ("created_at");
  CREATE INDEX "_clubs_v_updated_at_idx" ON "_clubs_v" USING btree ("updated_at");
  CREATE INDEX "_clubs_v_latest_idx" ON "_clubs_v" USING btree ("latest");
  CREATE INDEX "galleries_blocks_photo_order_idx" ON "galleries_blocks_photo" USING btree ("_order");
  CREATE INDEX "galleries_blocks_photo_parent_id_idx" ON "galleries_blocks_photo" USING btree ("_parent_id");
  CREATE INDEX "galleries_blocks_photo_path_idx" ON "galleries_blocks_photo" USING btree ("_path");
  CREATE INDEX "galleries_blocks_photo_image_idx" ON "galleries_blocks_photo" USING btree ("image_id");
  CREATE INDEX "galleries_blocks_video_embed_order_idx" ON "galleries_blocks_video_embed" USING btree ("_order");
  CREATE INDEX "galleries_blocks_video_embed_parent_id_idx" ON "galleries_blocks_video_embed" USING btree ("_parent_id");
  CREATE INDEX "galleries_blocks_video_embed_path_idx" ON "galleries_blocks_video_embed" USING btree ("_path");
  CREATE INDEX "galleries_blocks_video_file_order_idx" ON "galleries_blocks_video_file" USING btree ("_order");
  CREATE INDEX "galleries_blocks_video_file_parent_id_idx" ON "galleries_blocks_video_file" USING btree ("_parent_id");
  CREATE INDEX "galleries_blocks_video_file_path_idx" ON "galleries_blocks_video_file" USING btree ("_path");
  CREATE INDEX "galleries_blocks_video_file_video_idx" ON "galleries_blocks_video_file" USING btree ("video_id");
  CREATE UNIQUE INDEX "galleries_slug_idx" ON "galleries" USING btree ("slug");
  CREATE INDEX "galleries_date_idx" ON "galleries" USING btree ("date");
  CREATE INDEX "galleries_event_idx" ON "galleries" USING btree ("event_id");
  CREATE INDEX "galleries_cover_idx" ON "galleries" USING btree ("cover_id");
  CREATE INDEX "galleries_updated_at_idx" ON "galleries" USING btree ("updated_at");
  CREATE INDEX "galleries_created_at_idx" ON "galleries" USING btree ("created_at");
  CREATE INDEX "galleries__status_idx" ON "galleries" USING btree ("_status");
  CREATE INDEX "_galleries_v_blocks_photo_order_idx" ON "_galleries_v_blocks_photo" USING btree ("_order");
  CREATE INDEX "_galleries_v_blocks_photo_parent_id_idx" ON "_galleries_v_blocks_photo" USING btree ("_parent_id");
  CREATE INDEX "_galleries_v_blocks_photo_path_idx" ON "_galleries_v_blocks_photo" USING btree ("_path");
  CREATE INDEX "_galleries_v_blocks_photo_image_idx" ON "_galleries_v_blocks_photo" USING btree ("image_id");
  CREATE INDEX "_galleries_v_blocks_video_embed_order_idx" ON "_galleries_v_blocks_video_embed" USING btree ("_order");
  CREATE INDEX "_galleries_v_blocks_video_embed_parent_id_idx" ON "_galleries_v_blocks_video_embed" USING btree ("_parent_id");
  CREATE INDEX "_galleries_v_blocks_video_embed_path_idx" ON "_galleries_v_blocks_video_embed" USING btree ("_path");
  CREATE INDEX "_galleries_v_blocks_video_file_order_idx" ON "_galleries_v_blocks_video_file" USING btree ("_order");
  CREATE INDEX "_galleries_v_blocks_video_file_parent_id_idx" ON "_galleries_v_blocks_video_file" USING btree ("_parent_id");
  CREATE INDEX "_galleries_v_blocks_video_file_path_idx" ON "_galleries_v_blocks_video_file" USING btree ("_path");
  CREATE INDEX "_galleries_v_blocks_video_file_video_idx" ON "_galleries_v_blocks_video_file" USING btree ("video_id");
  CREATE INDEX "_galleries_v_parent_idx" ON "_galleries_v" USING btree ("parent_id");
  CREATE INDEX "_galleries_v_version_version_slug_idx" ON "_galleries_v" USING btree ("version_slug");
  CREATE INDEX "_galleries_v_version_version_date_idx" ON "_galleries_v" USING btree ("version_date");
  CREATE INDEX "_galleries_v_version_version_event_idx" ON "_galleries_v" USING btree ("version_event_id");
  CREATE INDEX "_galleries_v_version_version_cover_idx" ON "_galleries_v" USING btree ("version_cover_id");
  CREATE INDEX "_galleries_v_version_version_updated_at_idx" ON "_galleries_v" USING btree ("version_updated_at");
  CREATE INDEX "_galleries_v_version_version_created_at_idx" ON "_galleries_v" USING btree ("version_created_at");
  CREATE INDEX "_galleries_v_version_version__status_idx" ON "_galleries_v" USING btree ("version__status");
  CREATE INDEX "_galleries_v_created_at_idx" ON "_galleries_v" USING btree ("created_at");
  CREATE INDEX "_galleries_v_updated_at_idx" ON "_galleries_v" USING btree ("updated_at");
  CREATE INDEX "_galleries_v_latest_idx" ON "_galleries_v" USING btree ("latest");
  CREATE INDEX "brand_assets_updated_at_idx" ON "brand_assets" USING btree ("updated_at");
  CREATE INDEX "brand_assets_created_at_idx" ON "brand_assets" USING btree ("created_at");
  CREATE UNIQUE INDEX "brand_assets_filename_idx" ON "brand_assets" USING btree ("filename");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_videos_fk" FOREIGN KEY ("videos_id") REFERENCES "public"."videos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_clubs_fk" FOREIGN KEY ("clubs_id") REFERENCES "public"."clubs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_galleries_fk" FOREIGN KEY ("galleries_id") REFERENCES "public"."galleries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_brand_assets_fk" FOREIGN KEY ("brand_assets_id") REFERENCES "public"."brand_assets"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_section_idx" ON "pages" USING btree ("section");
  CREATE INDEX "_pages_v_version_version_section_idx" ON "_pages_v" USING btree ("version_section");
  CREATE INDEX "payload_locked_documents_rels_videos_id_idx" ON "payload_locked_documents_rels" USING btree ("videos_id");
  CREATE INDEX "payload_locked_documents_rels_clubs_id_idx" ON "payload_locked_documents_rels" USING btree ("clubs_id");
  CREATE INDEX "payload_locked_documents_rels_galleries_id_idx" ON "payload_locked_documents_rels" USING btree ("galleries_id");
  CREATE INDEX "payload_locked_documents_rels_brand_assets_id_idx" ON "payload_locked_documents_rels" USING btree ("brand_assets_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "videos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "clubs_socials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "clubs_contacts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "clubs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_clubs_v_version_socials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_clubs_v_version_contacts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_clubs_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "galleries_blocks_photo" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "galleries_blocks_video_embed" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "galleries_blocks_video_file" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "galleries" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_galleries_v_blocks_photo" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_galleries_v_blocks_video_embed" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_galleries_v_blocks_video_file" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_galleries_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "brand_assets" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "videos" CASCADE;
  DROP TABLE "clubs_socials" CASCADE;
  DROP TABLE "clubs_contacts" CASCADE;
  DROP TABLE "clubs" CASCADE;
  DROP TABLE "_clubs_v_version_socials" CASCADE;
  DROP TABLE "_clubs_v_version_contacts" CASCADE;
  DROP TABLE "_clubs_v" CASCADE;
  DROP TABLE "galleries_blocks_photo" CASCADE;
  DROP TABLE "galleries_blocks_video_embed" CASCADE;
  DROP TABLE "galleries_blocks_video_file" CASCADE;
  DROP TABLE "galleries" CASCADE;
  DROP TABLE "_galleries_v_blocks_photo" CASCADE;
  DROP TABLE "_galleries_v_blocks_video_embed" CASCADE;
  DROP TABLE "_galleries_v_blocks_video_file" CASCADE;
  DROP TABLE "_galleries_v" CASCADE;
  DROP TABLE "brand_assets" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_videos_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_clubs_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_galleries_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_brand_assets_fk";
  
  ALTER TABLE "news" ALTER COLUMN "category" SET DATA TYPE text;
  ALTER TABLE "news" ALTER COLUMN "category" SET DEFAULT 'general'::text;
  DROP TYPE "public"."enum_news_category";
  CREATE TYPE "public"."enum_news_category" AS ENUM('general', 'tournaments', 'national-teams', 'education', 'governance');
  ALTER TABLE "news" ALTER COLUMN "category" SET DEFAULT 'general'::"public"."enum_news_category";
  ALTER TABLE "news" ALTER COLUMN "category" SET DATA TYPE "public"."enum_news_category" USING "category"::"public"."enum_news_category";
  ALTER TABLE "_news_v" ALTER COLUMN "version_category" SET DATA TYPE text;
  ALTER TABLE "_news_v" ALTER COLUMN "version_category" SET DEFAULT 'general'::text;
  DROP TYPE "public"."enum__news_v_version_category";
  CREATE TYPE "public"."enum__news_v_version_category" AS ENUM('general', 'tournaments', 'national-teams', 'education', 'governance');
  ALTER TABLE "_news_v" ALTER COLUMN "version_category" SET DEFAULT 'general'::"public"."enum__news_v_version_category";
  ALTER TABLE "_news_v" ALTER COLUMN "version_category" SET DATA TYPE "public"."enum__news_v_version_category" USING "version_category"::"public"."enum__news_v_version_category";
  DROP INDEX "pages_section_idx";
  DROP INDEX "_pages_v_version_version_section_idx";
  DROP INDEX "payload_locked_documents_rels_videos_id_idx";
  DROP INDEX "payload_locked_documents_rels_clubs_id_idx";
  DROP INDEX "payload_locked_documents_rels_galleries_id_idx";
  DROP INDEX "payload_locked_documents_rels_brand_assets_id_idx";
  ALTER TABLE "pages" DROP COLUMN "section";
  ALTER TABLE "pages" DROP COLUMN "summary";
  ALTER TABLE "pages" DROP COLUMN "order";
  ALTER TABLE "_pages_v" DROP COLUMN "version_section";
  ALTER TABLE "_pages_v" DROP COLUMN "version_summary";
  ALTER TABLE "_pages_v" DROP COLUMN "version_order";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "videos_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "clubs_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "galleries_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "brand_assets_id";
  DROP TYPE "public"."enum_pages_section";
  DROP TYPE "public"."enum__pages_v_version_section";
  DROP TYPE "public"."enum_clubs_socials_platform";
  DROP TYPE "public"."enum_clubs_registration";
  DROP TYPE "public"."enum_clubs_district";
  DROP TYPE "public"."enum_clubs_status";
  DROP TYPE "public"."enum__clubs_v_version_socials_platform";
  DROP TYPE "public"."enum__clubs_v_version_registration";
  DROP TYPE "public"."enum__clubs_v_version_district";
  DROP TYPE "public"."enum__clubs_v_version_status";
  DROP TYPE "public"."enum_galleries_status";
  DROP TYPE "public"."enum__galleries_v_version_status";
  DROP TYPE "public"."enum_brand_assets_category";`)
}
