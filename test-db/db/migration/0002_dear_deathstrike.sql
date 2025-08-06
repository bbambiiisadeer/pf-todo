ALTER TABLE "todo" ADD COLUMN "scheduled_date" date;--> statement-breakpoint
ALTER TABLE "todo" ADD COLUMN "scheduled_time" time(0);--> statement-breakpoint
ALTER TABLE "todo" DROP COLUMN "todo_text2";--> statement-breakpoint
ALTER TABLE "todo" DROP COLUMN "todo_text3";