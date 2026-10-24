import type { Metadata } from "next";
import { SubmitForm } from "./submit-form";
export const metadata: Metadata={title:"Donate an Exhibit"};
export default function SubmitPage(){return <div className="page-wrap"><div className="breadcrumb">THE COLLECTION / DONATION OFFICE</div><h1 className="page-title">Make a contribution<br/>to questionable history.</h1><p className="page-intro">Every great institution begins with one remarkable act of judgment. Or a remarkably poor one. Tell us yours; the curators will handle the brass plaque.</p><SubmitForm/></div>}
