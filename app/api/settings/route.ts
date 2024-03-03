import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";

import { getUserByEmail, getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { SettingsSchema } from "@/schemas";
import * as z from "zod";
import bcrypt from "bcryptjs";

export async function PATCH(
  req: Request,
) {
  try {
    const session = await auth();
    const values = await req.json();

    const user = await currentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const dbUser = await getUserById(user.id);

    if (!dbUser) {
      return new NextResponse("Can not find user", { status: 401 });
    }

    if (user.isOAuth) {
      values.email = undefined;
      values.password = undefined;
      values.newPassword = undefined;
  }

    if (values.email && values.email !== user.email) {
      const existingUser = await getUserByEmail(values.email);

      if (existingUser && existingUser.id !== user.id) {
        return new NextResponse("Email already in use!", { status: 401 });
      }

      const verificationToken = await generateVerificationToken(
        values.email
      );

      await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token,
      );
      return NextResponse.json(verificationToken);
    }

    if (values.password && values.newPassword && dbUser.password) {
      const passwordsMatch = await bcrypt.compare(
        values.password,
        dbUser.password,
      );

      if (!passwordsMatch) {
        return new NextResponse("Incorrect password!", { status: 401 });
      }

      const hashedPassword = await bcrypt.hash(
        values.newPassword,
        10,
      );
      values.password = hashedPassword;
      values.newPassword = undefined;
    }

    const users = await db.user.update({
      where: { id: dbUser.id },
        data: {
            ...values,
        }
    });

    return NextResponse.json(users);
  } catch (error) {
    console.log("[USER_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}