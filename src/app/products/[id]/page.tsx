import React from "react";

const ProductPage = (props: any) => {
//   console.log(props);
  const { params } = props;

  return <div>Product Page for{params.id}</div>;
};

export default ProductPage;
