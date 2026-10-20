import { Button } from "@/components/ui/Button";
import { MediaCard } from "@/components/ui/MediaCard";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";

type Post = {
  title: string;
  excerpt: string;
  image: string;
  href: string;
};

type BlogRoundupProps = {
  title: string;
  description: string;
  posts: Post[];
};

export function BlogRoundup({ title, description, posts }: BlogRoundupProps) {
  return (
    <Section className="bg-optoro-mist text-optoro-graphite">
      <SectionHeader title={title} description={description} align="center" className="mb-12" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <MediaCard
            key={post.href}
            image={post.image}
            imageAlt={post.title}
            title={post.title}
            description={post.excerpt}
            className="bg-white shadow-sm"
            footer={
              <Button href={post.href} variant="link" className="text-optoro-orange">
                Read more →
              </Button>
            }
          />
        ))}
      </div>
    </Section>
  );
}
