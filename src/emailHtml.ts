const body = (product: any) =>
	`<div>
    <div>
    <img src="${product?.imageUrl}" alt="${product?.name}">
        <div>
            <h5>
                ${product?.name}
            </h5>
            <h5>
                Price: ${product?.price} JOD
            </h5>
            <h5>
            You have ordered ${product?.counter} item(s) of this product
        </h5>
        </div>
    </div>
</div>`;

export default async function createATemplate(
	products: any[],
	username: string,
	orderStatus: string,
) {
	const bodyProducts = [];
	for (const product of products) {
		await bodyProducts.push(body(product));
	}

	return orderStatus === 'accepted'
		? `<h1>Hello ${username}</h1>` +
				bodyProducts +
				`<h2>Thanks for trying my demo app</h2>` +
				`<div>
            <div><a href="https://github.com/MahmoudAlsaht">Github Account</a></div>
            <div><a href="https://www.linkedin.com/in/mahmoud-alsaht-0b621620a/">Linkedin Account</a></div>
            <div><a href="https://wa.me/962785384842">Whatsapp Account</a></div>
        </div>`
		: orderStatus === 'rejected' &&
				`<h1>Hello ${username}</h1>` +
					`<div>Sorry Your Last Order Has Been Rejected</div>` +
					`<h2>Thanks for trying my demo app</h2>` +
					`<div>
            <div><a href="https://github.com/MahmoudAlsaht">Github Account</a></div>
            <div><a href="https://www.linkedin.com/in/mahmoud-alsaht-0b621620a/">Linkedin Account</a></div>
            <div><a href="https://wa.me/962785384842">Whatsapp Account</a></div>
        </div>`;
}
