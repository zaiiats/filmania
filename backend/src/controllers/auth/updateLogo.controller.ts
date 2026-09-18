import { Request, Response } from "express";
import { asyncCatcher } from "../../utils/asyncCatcher";
import { generateOTP } from "../../utils/crypto";
import { prismaInstance } from "../../lib/prisma";
import { supabaseInstance } from "../../lib/supabaseInstance";
import { AppError } from "../../lib/AppError";

export const updateLogoController = asyncCatcher(
  async (req: Request, res: Response) => {
    const file = req.file as Express.Multer.File;
    const user = req.user!;

    const fileName = `usersProfile/profile_picture_${user.id}_${generateOTP(6)}_${Date.now()}`;

    const { error } = await supabaseInstance.storage
      .from("usersProfile")
      .upload(fileName, file?.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) {
      throw new AppError(error.message, 500);
    }

    const { data } = await supabaseInstance.storage
      .from("usersProfile")
      .getPublicUrl(fileName);

    await prismaInstance.$transaction(async (tx) => {
      await tx.user.update({
        where: {
          id: user?.id,
        },
        data: {
          profilePicture: data.publicUrl,
        },
      });
    });
  },
);
