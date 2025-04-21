'use server'

import { connectToDatabase } from '@/lib/db'
import Product, { IProduct } from '@/lib/db/models/product.model'
import { AVAILABLE_DELIVERY_DATES, PAGE_SIZE } from '../constants'
import { OrderItem, ShippingAddress } from '@/types'
import { round2 } from '../utils'

export async function getAllCategories() {
    await connectToDatabase()
    const categories = await Product.find({ isPublished: true }).distinct(
        'category'
    )
    return categories
}
export async function getProductsForCard({
    tag,
    limit = 4,
}: {
    tag: string
    limit?: number
}) {
    await connectToDatabase()
    const products = await Product.find(
        { tags: { $in: [tag] }, isPublished: true },
        {
            name: 1,
            href: { $concat: ['/product/', '$slug'] },
            image: { $arrayElemAt: ['$images', 0] },
        }
    )
        .sort({ createdAt: 'desc' })
        .limit(limit)
    return JSON.parse(JSON.stringify(products)) as {
        name: string
        href: string
        image: string
    }[]
}

export async function getProductsByTag({
    tag,
    limit = 10,
}: {
    tag: string
    limit?: number
}) {
    await connectToDatabase()
    const products = await Product.find({
        tags: { $in: [tag] },
        isPublished: true
    })
        .sort({ createdAt: 'desc' })
        .limit(limit)
    return JSON.parse(JSON.stringify(products)) as IProduct[]
}

// Get one product through slug

export async function getProductBySlug(slug: string) {
    await connectToDatabase()
    const product = await Product.findOne({
        slug, isPublished: true
    })
    if (!product) throw new Error('Product not found')
    return JSON.parse(JSON.stringify(product)) as IProduct
}

// Get related products: with same category

export async function getRelatedProductsByCategory({
    category,
    productId,
    limit = PAGE_SIZE,
    page = 1,
}: {
    category: string
    productId: string
    limit?: number
    page: number
}) {
    await connectToDatabase()
    const skipAmount = (Number(page) - 1) * limit
    const conditions = {
        isPublished: true,
        category,
        _id: { $ne: productId },
    }
    const products = await Product.find(conditions)
        .sort({ numSales: 'desc' })
        .skip(skipAmount)
        .limit(limit)
    const productsCount = await Product.countDocuments(conditions)
    return {
        data: JSON.parse(JSON.stringify(products)) as IProduct[],
        totalPages: Math.ceil(productsCount / limit),
    }
}

export const calcDeliveryDateAndPrice = async ({
    items,
    shippingAddress,
    deliveryDateIndex,
}: {
    deliveryDateIndex?: number
    items: OrderItem[]
    shippingAddress?: ShippingAddress
}) => {
    const itemsPrice = round2(
        items.reduce((acc, item) => acc + item.price * item.quantity, 0)
    )

    const deliveryDate = AVAILABLE_DELIVERY_DATES[deliveryDateIndex === undefined ? AVAILABLE_DELIVERY_DATES.length - 1 : deliveryDateIndex]
    const shippingPrice = !shippingAddress || !deliveryDate
        ? undefined
        : deliveryDate.freeShippingMinPrice > 0 &&
          itemsPrice >= deliveryDate.freeShippingMinPrice
        ? 0
        : deliveryDate.shippingPrice
    const taxPrice = !shippingAddress ? undefined : round2(itemsPrice * 0.15)

    // const shippingPrice = itemsPrice > FREE_SHIPPING_MIN_PRICE ? 0 : 5
    // const taxPrice = round2(itemsPrice * 0.15)
    const totalPrice = round2(
        itemsPrice +
        (shippingPrice ? round2(shippingPrice) : 0) +
        (taxPrice ? round2(taxPrice) : 0)
    )
    return {
        AVAILABLE_DELIVERY_DATES,
        deliveryDateIndex: 
          deliveryDateIndex === undefined
            ? AVAILABLE_DELIVERY_DATES.length - 1
            : deliveryDateIndex,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
    }
}