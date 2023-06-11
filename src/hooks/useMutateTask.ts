import { trpc } from "../utils/trpc";
import useStore from "../store";

export const useMutateTask = () => {
  /** キャッシュされているデータのアクセス先 */
  const utils = trpc.useContext();
  /** zustandのstore中のeditedTaskの状態をリセット */
  const reset = useStore((state) => state.resetEditedTask);

  /** サーバーサイドで定義した関数をクライアントサイドからリモートプロシージャコールで直接呼び出し、タスクを作成 */
  const createTaskMutation = trpc.todo.createTask.useMutation({
    onSuccess: (res) => {
      const previousTodos = utils.todo.getTasks.getData();
      if (previousTodos) {
        // 既存のタスクが存在するなら、既存のタスクの先頭に新しく作成したタスクを追加し、キャッシュを更新
        utils.todo.getTasks.setData(undefined, [res, ...previousTodos]);
      }
      reset();
    },
  });

  /** サーバーサイドで定義した関数をクライアントサイドからリモートプロシージャコールで直接呼び出し、タスクを更新 */
  const updateTaskMutation = trpc.todo.updateTask.useMutation({
    onSuccess: (res) => {
      const previousTodos = utils.todo.getTasks.getData();
      if (previousTodos) {
        utils.todo.getTasks.setData(
          undefined,
          // 個別のタスクのIDと更新したタスクのIDと一致する場合だけ、更新後のオブジェクトに置き換え
          previousTodos.map((task) => (task.id === res.id ? res : task))
        );
      }
      reset();
    },
  });

  /** サーバーサイドで定義した関数をクライアントサイドからリモートプロシージャコールで直接呼び出し、タスクを削除 */
  const deleteTaskMutation = trpc.todo.deleteTask.useMutation({
    // _：deleteTaskの返り値を受け取る。variables：deleteTaskのinputの引数の値を受け取る。
    onSuccess: (_, variables) => {
      const previousTodos = utils.todo.getTasks.getData();
      if (previousTodos) {
        utils.todo.getTasks.setData(
          undefined,
          // 削除したタスクのIDと一致しないタスクだけにフィルタリング
          previousTodos.filter((task) => task.id !== variables.taskId)
        );
      }
      reset();
    },
  });

  return { createTaskMutation, updateTaskMutation, deleteTaskMutation };
};
