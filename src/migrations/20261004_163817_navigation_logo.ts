import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "navigation" ADD COLUMN "logo_id" integer;
  ALTER TABLE "navigation" ADD CONSTRAINT "navigation_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "navigation_logo_idx" ON "navigation" USING btree ("logo_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "navigation" DROP CONSTRAINT "navigation_logo_id_media_id_fk";
  
  DROP INDEX "navigation_logo_idx";
  ALTER TABLE "navigation" DROP COLUMN "logo_id";`)
}
