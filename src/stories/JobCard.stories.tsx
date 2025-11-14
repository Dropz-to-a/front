import type { Meta, StoryObj } from "@storybook/react";
import { JobCard } from "../components/Jobs/JobCard";
import { BrowserRouter } from "react-router-dom";
import type { Job } from "../pages/Jobs";

const meta: Meta<typeof JobCard> = {
    title: "JobIT/JobCard",
    component: JobCard,
    decorators: [
        (Story) => (
            <BrowserRouter>
                <div style={{ width: "360px", margin: "20px", }}>
                    <Story />
                </div>
            </BrowserRouter>    
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof JobCard>;

// 샘플 job 데이터  
const sampleJob: Job = {
    id: "tving-1",
    company: "TVING",
    title: "Frontend 개발자",
    description: "React 기반 개발 경험자 채용",
    location: "서울",
    salaryNote: "연봉 협의",
    badges: ["React", "JS", "신입 가능"],
    dday: 7,
    verified: false,
    hot: false,
    new: false,
    category: "개발",
    imageUrl: "",
    logoUrl: "",
    applyUrl: "/jobs/tving-1", // 내부 링크
};

export const Default: Story = {
    args: {
        job: sampleJob,
    },
};

export const Hot: Story = {
    args: {
        job: {
            ...sampleJob,
            hot: true,
            dday: 2,
        },
    },
};

export const Closed: Story = {
    args: {
        job: {
            ...sampleJob,
            dday: -1,
        },
    },
};

export const New: Story = {
    args: {
        job: {
            ...sampleJob,
            new: true,
        },
    },
};

export const ExternalLink: Story = {
    args: {
        job: {
            ...sampleJob,
            applyUrl: "https://www.naver.com/",
        },
    },
};
