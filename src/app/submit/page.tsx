import type { Metadata } from "next";
import { SubmitForm } from "./submit-form";
export const metadata: Metadata={title:"Submit a Story"};
export default function SubmitPage(){return <div className="page-wrap"><div className="breadcrumb">THE MUSEUM / SHARE YOUR STORY</div><h1 className="page-title">Share your everyday mistake.</h1><p className="page-intro">Anonymous by default. Add a display name if you like.</p><SubmitForm/></div>}
