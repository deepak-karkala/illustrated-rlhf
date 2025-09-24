import type { MDXComponents } from 'mdx/types';
import Image from 'next/image';
import Link from 'next/link';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    a: ({ href = '', ...props }) => (
      <Link
        href={href}
        className="text-primary underline underline-offset-4 hover:text-primary/80"
        {...props}
      />
    ),
    img: ({ src, alt = '', width, height, ...rest }) => {
      if (!src) {
        return null;
      }

      const imageSrc = typeof src === 'string' ? src : (src as any);

      return (
        <Image
          className="rounded-lg"
          src={imageSrc}
          alt={alt}
          width={width ? Number(width) : 800}
          height={height ? Number(height) : 600}
          {...rest}
        />
      );
    },
    ul: (props) => <ul className="ml-6 list-disc space-y-2" {...props} />,
    ol: (props) => <ol className="ml-6 list-decimal space-y-2" {...props} />,
    ...components,
  };
}
