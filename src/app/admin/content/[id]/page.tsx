import { prisma } from "@/lib/prisma";
import ContentEditor from "../_components/ContentEditor";
import { notFound } from "next/navigation";

export default async function EditContentPage({ params }: { params: { id: string } }) {
    const { id } = await params;

    const post = await prisma.post.findUnique({
        where: { id },
    });

    if (!post) notFound();

    return <ContentEditor initialData={post} id={id} />;
}
