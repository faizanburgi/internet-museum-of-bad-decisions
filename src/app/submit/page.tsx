import type { Metadata } from "next";
import { SubmitForm } from "./submit-form";
export const metadata: Metadata={title:"Submit a Story"};
export default function SubmitPage(){return <div className="page-wrap"><div className="breadcrumb">THE MUSEUM / SHARE YOUR STORY</div><h1 className="page-title">Share your everyday mistake.</h1><p className="page-intro">Tell us what happened. You can submit anonymously or choose a display name. A human curator reviews every story before it can appear in the public museum.</p><SubmitForm/></div>}
