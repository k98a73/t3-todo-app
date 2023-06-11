import { create } from "zustand";
import type { updateTaskInput } from "../schema/todo";

type State = {
  editedTask: updateTaskInput;
  updateEditedTask: (payload: updateTaskInput) => void;
  resetEditedTask: () => void;
};

const useStore = create<State>((set) => ({
  editedTask: { taskId: "", title: "", body: "", updatedAt: null },
  updateEditedTask: (payload) =>
    set({
      editedTask: payload,
    }),
  resetEditedTask: () =>
    set({ editedTask: { taskId: "", title: "", body: "", updatedAt: null } }),
}));

export default useStore;
