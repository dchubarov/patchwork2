"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const readline_sync_1 = __importDefault(require("readline-sync"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
const BCRYPT_SALT_ROUNDS = 10;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const pwd = readline_sync_1.default.question('Initial user password: ', {
            hideEchoBack: true,
        });
        let hashedPassword = yield bcrypt_1.default.hash(pwd, BCRYPT_SALT_ROUNDS);
        yield prisma.user.upsert({
            where: { email: 'dime@twowls.org' },
            update: {},
            create: {
                username: 'dime',
                email: 'dime@twowls.org',
                password: hashedPassword,
                firstname: 'Dmitry',
            },
        });
    });
}
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.$disconnect(); }))
    .catch((err) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(err);
    yield prisma.$disconnect();
    process.exit(1);
}));
