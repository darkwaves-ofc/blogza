import { getBlogs } from '@/actions/blogActions';
import Header from '@/components/common/Header';
import ClientSearch from '@/components/blog/ClientSearch';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default async function AllBlogs() {
  const blogs = await getBlogs();

  return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
              All Blogs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ClientSearch blogs={blogs} />
          </CardContent>
        </Card>
      </div>
  );
}
