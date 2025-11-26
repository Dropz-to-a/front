import type { Meta, StoryObj } from "@storybook/react";
import Header from "../components/Header";
import { BrowserRouter } from "react-router-dom";

// ==================================================================
// Storybook 환경 전용 Wrapper
// → 실제 Header는 localStorage.currentUser를 읽기 때문에
//   스토리에서 해당 값을 미리 세팅해줘야 한다.
// ==================================================================

const HeaderWrapper = ({
    loggedIn,
    userType,
}: {
    loggedIn: boolean;
    userType: "personal" | "company" | null;
}) => {
    // Storybook에서 localStorage 환경을 강제로 셋업
    if (loggedIn && userType) {
        localStorage.setItem(
            "currentUser",
            JSON.stringify({
                id: "123",
                email: "test@example.com",
                name: userType === "personal" ? "홍길동" : "회사담당자",
                userType,
            })
        );
        localStorage.setItem("token", "fake-jwt-token");
    } else {
        localStorage.removeItem("currentUser");
        localStorage.removeItem("token");
    }

    return <Header />;
};

// ==================================================================
// Meta 설정
// ==================================================================

const meta: Meta<typeof HeaderWrapper> = {
    title: "JobIT/Header",
    component: HeaderWrapper,
    decorators: [
        (Story) => (
            <BrowserRouter>
                <div style={{ boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
                    <Story />
                </div>
            </BrowserRouter>
        ),
    ],
    argTypes: {
        loggedIn: {
            name: "로그인 여부",
            control: "boolean",
        },
        userType: {
            name: "유저 타입",
            control: "radio",
            options: ["personal", "company", null],
        },
    },
};

export default meta;

type Story = StoryObj<typeof HeaderWrapper>;

// ==================================================================
// 스토리
// ==================================================================

export const LoggedOut: Story = {
    args: {
        loggedIn: false,
        userType: null,
    },
};

export const PersonalUser: Story = {
    args: {
        loggedIn: true,
        userType: "personal",
    },
};

export const CompanyUser: Story = {
    args: {
        loggedIn: true,
        userType: "company",
    },
};
    