import { redirect } from "@/i18n/navigation";

type Props = { params: Promise<{ locale: string }> };

export default async function StandardStandAliasPage({ params }: Props) {
  const { locale } = await params;
  redirect({ href: "/configure/standard-review-stand", locale });
}
