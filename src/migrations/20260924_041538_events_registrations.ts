import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_events_type" AS ENUM('tournament', 'school', 'deadline', 'national-team', 'seminar');
  CREATE TYPE "public"."enum_events_registration_age_reference_date" AS ENUM('jan-1', 'dec-31');
  CREATE TYPE "public"."enum_events_registration_fields_date_of_birth" AS ENUM('required', 'optional', 'hidden');
  CREATE TYPE "public"."enum_events_registration_fields_sex" AS ENUM('required', 'optional', 'hidden');
  CREATE TYPE "public"."enum_events_registration_fields_email" AS ENUM('required', 'optional', 'hidden');
  CREATE TYPE "public"."enum_events_registration_fields_phone" AS ENUM('required', 'optional', 'hidden');
  CREATE TYPE "public"."enum_events_registration_fields_school_or_club" AS ENUM('required', 'optional', 'hidden');
  CREATE TYPE "public"."enum_events_registration_fields_coach" AS ENUM('required', 'optional', 'hidden');
  CREATE TYPE "public"."enum_events_registration_fields_rating" AS ENUM('required', 'optional', 'hidden');
  CREATE TYPE "public"."enum_events_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__events_v_version_type" AS ENUM('tournament', 'school', 'deadline', 'national-team', 'seminar');
  CREATE TYPE "public"."enum__events_v_version_registration_age_reference_date" AS ENUM('jan-1', 'dec-31');
  CREATE TYPE "public"."enum__events_v_version_registration_fields_date_of_birth" AS ENUM('required', 'optional', 'hidden');
  CREATE TYPE "public"."enum__events_v_version_registration_fields_sex" AS ENUM('required', 'optional', 'hidden');
  CREATE TYPE "public"."enum__events_v_version_registration_fields_email" AS ENUM('required', 'optional', 'hidden');
  CREATE TYPE "public"."enum__events_v_version_registration_fields_phone" AS ENUM('required', 'optional', 'hidden');
  CREATE TYPE "public"."enum__events_v_version_registration_fields_school_or_club" AS ENUM('required', 'optional', 'hidden');
  CREATE TYPE "public"."enum__events_v_version_registration_fields_coach" AS ENUM('required', 'optional', 'hidden');
  CREATE TYPE "public"."enum__events_v_version_registration_fields_rating" AS ENUM('required', 'optional', 'hidden');
  CREATE TYPE "public"."enum__events_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_registrations_sex" AS ENUM('m', 'w');
  CREATE TABLE "files" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
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
  
  CREATE TABLE "events_registration_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"max_age" numeric,
  	"min_rating" numeric,
  	"max_rating" numeric,
  	"capacity" numeric
  );
  
  CREATE TABLE "events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"type" "enum_events_type" DEFAULT 'tournament',
  	"start_date" timestamp(3) with time zone,
  	"end_date" timestamp(3) with time zone,
  	"venue" varchar,
  	"summary" varchar,
  	"description" jsonb,
  	"eligibility" jsonb,
  	"prospectus_id" integer,
  	"chess_results_url" varchar,
  	"registration_enabled" boolean DEFAULT false,
  	"registration_opens_at" timestamp(3) with time zone,
  	"registration_closes_at" timestamp(3) with time zone,
  	"registration_fee" varchar,
  	"registration_payment_instructions" varchar,
  	"registration_age_reference_date" "enum_events_registration_age_reference_date" DEFAULT 'jan-1',
  	"registration_fields_date_of_birth" "enum_events_registration_fields_date_of_birth" DEFAULT 'required',
  	"registration_fields_sex" "enum_events_registration_fields_sex" DEFAULT 'optional',
  	"registration_fields_email" "enum_events_registration_fields_email" DEFAULT 'optional',
  	"registration_fields_phone" "enum_events_registration_fields_phone" DEFAULT 'required',
  	"registration_fields_school_or_club" "enum_events_registration_fields_school_or_club" DEFAULT 'optional',
  	"registration_fields_coach" "enum_events_registration_fields_coach" DEFAULT 'hidden',
  	"registration_fields_rating" "enum_events_registration_fields_rating" DEFAULT 'optional',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_events_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_events_v_version_registration_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"max_age" numeric,
  	"min_rating" numeric,
  	"max_rating" numeric,
  	"capacity" numeric,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_events_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_type" "enum__events_v_version_type" DEFAULT 'tournament',
  	"version_start_date" timestamp(3) with time zone,
  	"version_end_date" timestamp(3) with time zone,
  	"version_venue" varchar,
  	"version_summary" varchar,
  	"version_description" jsonb,
  	"version_eligibility" jsonb,
  	"version_prospectus_id" integer,
  	"version_chess_results_url" varchar,
  	"version_registration_enabled" boolean DEFAULT false,
  	"version_registration_opens_at" timestamp(3) with time zone,
  	"version_registration_closes_at" timestamp(3) with time zone,
  	"version_registration_fee" varchar,
  	"version_registration_payment_instructions" varchar,
  	"version_registration_age_reference_date" "enum__events_v_version_registration_age_reference_date" DEFAULT 'jan-1',
  	"version_registration_fields_date_of_birth" "enum__events_v_version_registration_fields_date_of_birth" DEFAULT 'required',
  	"version_registration_fields_sex" "enum__events_v_version_registration_fields_sex" DEFAULT 'optional',
  	"version_registration_fields_email" "enum__events_v_version_registration_fields_email" DEFAULT 'optional',
  	"version_registration_fields_phone" "enum__events_v_version_registration_fields_phone" DEFAULT 'required',
  	"version_registration_fields_school_or_club" "enum__events_v_version_registration_fields_school_or_club" DEFAULT 'optional',
  	"version_registration_fields_coach" "enum__events_v_version_registration_fields_coach" DEFAULT 'hidden',
  	"version_registration_fields_rating" "enum__events_v_version_registration_fields_rating" DEFAULT 'optional',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__events_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "registrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"display_name" varchar,
  	"event_id" integer NOT NULL,
  	"section_name" varchar NOT NULL,
  	"section_id" varchar NOT NULL,
  	"last_name" varchar NOT NULL,
  	"other_names" varchar NOT NULL,
  	"fide_id" varchar,
  	"rating" numeric,
  	"date_of_birth" varchar,
  	"sex" "enum_registrations_sex",
  	"email" varchar,
  	"phone" varchar,
  	"school_or_club" varchar,
  	"coach" varchar,
  	"guardian_name" varchar,
  	"guardian_contact" varchar,
  	"paid" boolean DEFAULT false,
  	"paid_at" timestamp(3) with time zone,
  	"paid_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "files_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "events_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "registrations_id" integer;
  ALTER TABLE "events_registration_sections" ADD CONSTRAINT "events_registration_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_prospectus_id_files_id_fk" FOREIGN KEY ("prospectus_id") REFERENCES "public"."files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v_version_registration_sections" ADD CONSTRAINT "_events_v_version_registration_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_parent_id_events_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_prospectus_id_files_id_fk" FOREIGN KEY ("version_prospectus_id") REFERENCES "public"."files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "registrations" ADD CONSTRAINT "registrations_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "registrations" ADD CONSTRAINT "registrations_paid_by_id_users_id_fk" FOREIGN KEY ("paid_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "files_updated_at_idx" ON "files" USING btree ("updated_at");
  CREATE INDEX "files_created_at_idx" ON "files" USING btree ("created_at");
  CREATE UNIQUE INDEX "files_filename_idx" ON "files" USING btree ("filename");
  CREATE INDEX "events_registration_sections_order_idx" ON "events_registration_sections" USING btree ("_order");
  CREATE INDEX "events_registration_sections_parent_id_idx" ON "events_registration_sections" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "events_slug_idx" ON "events" USING btree ("slug");
  CREATE INDEX "events_start_date_idx" ON "events" USING btree ("start_date");
  CREATE INDEX "events_prospectus_idx" ON "events" USING btree ("prospectus_id");
  CREATE INDEX "events_updated_at_idx" ON "events" USING btree ("updated_at");
  CREATE INDEX "events_created_at_idx" ON "events" USING btree ("created_at");
  CREATE INDEX "events__status_idx" ON "events" USING btree ("_status");
  CREATE INDEX "_events_v_version_registration_sections_order_idx" ON "_events_v_version_registration_sections" USING btree ("_order");
  CREATE INDEX "_events_v_version_registration_sections_parent_id_idx" ON "_events_v_version_registration_sections" USING btree ("_parent_id");
  CREATE INDEX "_events_v_parent_idx" ON "_events_v" USING btree ("parent_id");
  CREATE INDEX "_events_v_version_version_slug_idx" ON "_events_v" USING btree ("version_slug");
  CREATE INDEX "_events_v_version_version_start_date_idx" ON "_events_v" USING btree ("version_start_date");
  CREATE INDEX "_events_v_version_version_prospectus_idx" ON "_events_v" USING btree ("version_prospectus_id");
  CREATE INDEX "_events_v_version_version_updated_at_idx" ON "_events_v" USING btree ("version_updated_at");
  CREATE INDEX "_events_v_version_version_created_at_idx" ON "_events_v" USING btree ("version_created_at");
  CREATE INDEX "_events_v_version_version__status_idx" ON "_events_v" USING btree ("version__status");
  CREATE INDEX "_events_v_created_at_idx" ON "_events_v" USING btree ("created_at");
  CREATE INDEX "_events_v_updated_at_idx" ON "_events_v" USING btree ("updated_at");
  CREATE INDEX "_events_v_latest_idx" ON "_events_v" USING btree ("latest");
  CREATE INDEX "registrations_event_idx" ON "registrations" USING btree ("event_id");
  CREATE INDEX "registrations_fide_id_idx" ON "registrations" USING btree ("fide_id");
  CREATE INDEX "registrations_paid_by_idx" ON "registrations" USING btree ("paid_by_id");
  CREATE INDEX "registrations_updated_at_idx" ON "registrations" USING btree ("updated_at");
  CREATE INDEX "registrations_created_at_idx" ON "registrations" USING btree ("created_at");
  CREATE UNIQUE INDEX "event_fideId_idx" ON "registrations" USING btree ("event_id","fide_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_files_fk" FOREIGN KEY ("files_id") REFERENCES "public"."files"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_registrations_fk" FOREIGN KEY ("registrations_id") REFERENCES "public"."registrations"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_files_id_idx" ON "payload_locked_documents_rels" USING btree ("files_id");
  CREATE INDEX "payload_locked_documents_rels_events_id_idx" ON "payload_locked_documents_rels" USING btree ("events_id");
  CREATE INDEX "payload_locked_documents_rels_registrations_id_idx" ON "payload_locked_documents_rels" USING btree ("registrations_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "files" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "events_registration_sections" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "events" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_events_v_version_registration_sections" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_events_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "registrations" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "files" CASCADE;
  DROP TABLE "events_registration_sections" CASCADE;
  DROP TABLE "events" CASCADE;
  DROP TABLE "_events_v_version_registration_sections" CASCADE;
  DROP TABLE "_events_v" CASCADE;
  DROP TABLE "registrations" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_files_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_events_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_registrations_fk";
  
  DROP INDEX "payload_locked_documents_rels_files_id_idx";
  DROP INDEX "payload_locked_documents_rels_events_id_idx";
  DROP INDEX "payload_locked_documents_rels_registrations_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "files_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "events_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "registrations_id";
  DROP TYPE "public"."enum_events_type";
  DROP TYPE "public"."enum_events_registration_age_reference_date";
  DROP TYPE "public"."enum_events_registration_fields_date_of_birth";
  DROP TYPE "public"."enum_events_registration_fields_sex";
  DROP TYPE "public"."enum_events_registration_fields_email";
  DROP TYPE "public"."enum_events_registration_fields_phone";
  DROP TYPE "public"."enum_events_registration_fields_school_or_club";
  DROP TYPE "public"."enum_events_registration_fields_coach";
  DROP TYPE "public"."enum_events_registration_fields_rating";
  DROP TYPE "public"."enum_events_status";
  DROP TYPE "public"."enum__events_v_version_type";
  DROP TYPE "public"."enum__events_v_version_registration_age_reference_date";
  DROP TYPE "public"."enum__events_v_version_registration_fields_date_of_birth";
  DROP TYPE "public"."enum__events_v_version_registration_fields_sex";
  DROP TYPE "public"."enum__events_v_version_registration_fields_email";
  DROP TYPE "public"."enum__events_v_version_registration_fields_phone";
  DROP TYPE "public"."enum__events_v_version_registration_fields_school_or_club";
  DROP TYPE "public"."enum__events_v_version_registration_fields_coach";
  DROP TYPE "public"."enum__events_v_version_registration_fields_rating";
  DROP TYPE "public"."enum__events_v_version_status";
  DROP TYPE "public"."enum_registrations_sex";`)
}
