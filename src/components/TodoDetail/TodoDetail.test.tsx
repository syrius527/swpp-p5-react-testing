import { screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route, Navigate } from "react-router";
import { renderWithProviders } from "../../test-utils/mocks";
import TodoDetail from "./TodoDetail";
import axios from "axios";


const renderTodoDetail = () => {
    renderWithProviders(
        <MemoryRouter>
            <Routes>
                <Route path="/todo-detail/:id" element={<TodoDetail />}/>
                <Route path="*" element={<Navigate to={"/todo-detail/3"}/>}/>
            </Routes>
        </MemoryRouter>,
        {
            preloadedState: {
                todo: {
                    todos: [
                        {id: 3, title: "TODO_DETAIL_TEST_TITLE_3", content: "TODO_DETAIL_TEST_CONTENT_3", done: false},
                    ],
                    selectedTodo: null,
                },
            },
        },
    );
};

describe("<TodoDetail />", () => {
    it("should render without errors", async () => {
        jest.spyOn(axios, "get").mockImplementation(() => {
            return Promise.resolve({
                data: {
                    id: 3,
                    title: "TODO_DETAIL_TEST_TITLE_3",
                    content: "TODO_DETAIL_TEST_CONTENT_3",
                    done: false,
                },
            });
        });

        renderTodoDetail();
        await screen.findByText("TODO_DETAIL_TEST_TITLE_3");
        await screen.findByText("TODO_DETAIL_TEST_CONTENT_3");
    });

    it("should not render if there is no todo", async () => {
        renderTodoDetail();
        jest.spyOn(axios, "get").mockImplementation(() => Promise.reject());
        expect(screen.queryAllByText("TODO_DETIAL_TEST_TITLE_3")).toHaveLength(0);
    });
});