import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const waitlist = sqliteTable('waitlist', {
 email: text('email').primaryKey(),
 interest: text('interest', { enum: ['sending', 'travelling', 'both'] }).notNull(),
 beta: integer('beta', {mode:'boolean'}).notNull(),
 createdAt: text('created_at').notNull(),
});
