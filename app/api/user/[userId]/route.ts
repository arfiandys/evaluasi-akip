import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import { getUserByEmail, getUserById } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import bcrypt from "bcryptjs";

export async function DELETE(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await db.user.findUnique({
      where: {
        id: params.userId,
      },
    });

    if (!user) {
      return new NextResponse("Not found", { status: 404 });
    }

    const deletedUser = await db.user.delete({
      where: {
        id: params.userId,
      },
    });

    return NextResponse.json(deletedUser);
  } catch (error) {
    console.log("[COURSE_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user.id;
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const koordinatorUser = await getUserById(userId);

    if (!koordinatorUser) {
      return new NextResponse("Can not find koordinator user", { status: 401 });
    }

    const dbUser = await getUserById(params.userId);

    if (!dbUser) {
      return new NextResponse("Can not find user", { status: 401 });
    }

    if (dbUser.accounts.length) {
      values.email = undefined;
      values.password = undefined;
      values.newPassword = undefined;
    }

    if (values.email && values.email !== dbUser.email) {
      const existingUser = await getUserByEmail(values.email);

      if (existingUser && existingUser.id !== dbUser.id) {
        return NextResponse.json({ error: "Email talah digunakan!" });
      }

      const verificationToken = await generateVerificationToken(
        values.email
      );

      await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token,
      );
    }

    if (values.password && values.newPassword && koordinatorUser.password) {
      const passwordsMatch = await bcrypt.compare(
        values.password,
        koordinatorUser.password
      );

      if (!passwordsMatch) {
        return NextResponse.json({ error: "Password koordinator yang anda masukkan salah!" });
      }

      const hashedPassword = await bcrypt.hash(
        values.newPassword,
        10,
      );
      values.password = hashedPassword;
      values.newPassword = undefined;
    }

    const user = await db.user.update({
      where: {
        id: params.userId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log("[PENGGUNA]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}