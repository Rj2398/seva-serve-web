const Page = async ({ params }: any) => {

  const { id } = await params;

  return (
    <div>
      <h1>ID: {id}</h1>
    </div>
  );
};

export default Page;