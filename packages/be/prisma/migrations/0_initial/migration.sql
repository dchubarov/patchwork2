-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "authType" TEXT NOT NULL DEFAULT 'internal',
    "roles" TEXT,
    "password" TEXT,
    "firstname" TEXT,
    "lastname" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "token_grants" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "refreshedAt" DATETIME NOT NULL,
    "revokedAt" DATETIME,
    CONSTRAINT "token_grants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE INDEX "token_grants_userId_idx" ON "token_grants"("userId");

-- CreateIndex
CREATE INDEX "token_grants_expiresAt_idx" ON "token_grants"("expiresAt");

