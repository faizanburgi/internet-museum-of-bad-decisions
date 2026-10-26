/* eslint react/no-unescaped-entities: off */
import type { Metadata } from "next";
import Link from "next/link";
import { getExhibits } from "@/lib/supabase";
import { ExhibitCard } from "@/components/exhibit-card";
export const metadata:Metadata={title:"Hall of Shame"};
export default async function HallPage(){const exhibits=await getExhibits({limit:24,order:"popular"});return <div className="page-wrap"><div className="breadcrumb">THE MUSEUM / MOST-LOVED STORIES</div><h1 className="page-title">Community Favorites</h1><p className="page-intro">The stories visitors reacted to most. These real submissions were reviewed by a human curator and shared with the community.</p><div className="notice">The weekly winners' gallery will update as the museum receives its first approved exhibits and community reactions.</div>{exhibits.length?<div className="exhibit-grid">{exhibits.map((item)=><ExhibitCard key={item.id} exhibit={item}/>)}</div>:<div className="empty-state"><strong>No community favorites yet.</strong>One legendary miscalculation will set history in motion.<p><Link className="text-link" href="/submit">Nominate the inaugural exhibit →</Link></p></div>}</div>}
