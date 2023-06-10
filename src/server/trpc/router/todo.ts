import {
  createTaskSchema,
  getSingleTaskSchema,
  updateTaskSchema,
  deleteTaskSchema,
} from "../../../schema/todo";
import { router, publicProcedure, protectedProcedure } from "../trpc";

export const todoRouter = router({
  /** タスクの作成。ログインユーザーのみ。 */
  createTask: protectedProcedure
    .input(createTaskSchema)
    .mutation(async ({ ctx, input }) => {
      const task = await ctx.prisma.task.create({
        data: {
          ...input,
          user: {
            // ログインしているユーザーの情報を展開
            connect: {
              id: ctx.session?.user?.id,
            },
          },
          updatedAt: new Date(),
        },
      });
      return task;
    }),

  /** 複数のタスクを取得。ログイン不要。 */
  getTasks: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.task.findMany({
      where: {
        userId: ctx.session?.user?.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),

  /** 1つのタスクを取得。ログインユーザーのみ。 */
  getSingleTask: protectedProcedure
    .input(getSingleTaskSchema)
    .query(({ ctx, input }) => {
      return ctx.prisma.task.findUnique({
        where: {
          id: input.taskId,
        },
      });
    }),

  /** タスクの更新。ログインユーザーのみ。 */
  updateTask: protectedProcedure
    .input(updateTaskSchema)
    .mutation(async ({ ctx, input }) => {
      const task = await ctx.prisma.task.update({
        where: {
          id: input.taskId,
        },
        data: {
          title: input.title,
          body: input.body,
        },
      });
      return task;
    }),

  /** タスクの削除。ログインユーザーのみ。 */
  deleteTask: protectedProcedure
    .input(deleteTaskSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.task.delete({
        where: {
          id: input.taskId,
        },
      });
    }),
});
