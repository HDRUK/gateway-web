import { Box } from "@mui/material";
import { getHomePage, getSortedNewsEventsByDate } from "@/utils/cms";
import { logger } from "@/utils/logger";
import Homepage from "./components/Homepage";

export default async function HomePage() {
    const cmsContent = await getHomePage();

    const sortedPosts = getSortedNewsEventsByDate(cmsContent.posts.edges);

    const aLargeError = {
        error: {
            code: 500,
            type: "InternalServerError",
            message:
                "An unexpected error occurred while processing your request.",
            timestamp: "2025-07-22T18:34:55.182Z",
            requestId: "a1e9c4b3-7f02-4d3d-ae35-5c91b2fc943b",
            path: "/api/v2/orders/checkout",
            method: "POST",
            status: "error",
            details: {
                exception: {
                    type: "NullReferenceException",
                    message:
                        "Object reference not set to an instance of an object.",
                    stackTrace: [
                        "at OrdersService.ProcessOrder(Order order) in OrdersService.cs:line 182",
                        "at OrdersController.Checkout(OrderRequest request) in OrdersController.cs:line 45",
                        "at lambda_method(Closure , Object , Object[] )",
                        "at System.Web.Http.Controllers.ReflectedHttpActionDescriptor.ActionExecutor.Execute(Object instance, Object[] arguments)",
                    ],
                    source: "OrdersService",
                },
                user: {
                    id: "8472",
                    email: "testuser@example.com",
                    roles: ["customer", "beta-tester"],
                    ip: "192.168.0.15",
                    location: {
                        country: "US",
                        region: "California",
                        city: "Los Angeles",
                    },
                    browser: {
                        name: "Chrome",
                        version: "125.0.6422.112",
                    },
                    device: "Desktop",
                },
                requestPayload: {
                    cartId: "34890",
                    items: [
                        {
                            productId: "A-9312",
                            quantity: 2,
                            price: 19.99,
                        },
                        {
                            productId: "B-4598",
                            quantity: 1,
                            price: 49.99,
                        },
                    ],
                    paymentMethod: "credit_card",
                    shippingAddress: {
                        name: "Jane Doe",
                        line1: "123 Elm Street",
                        city: "Los Angeles",
                        state: "CA",
                        postalCode: "90001",
                        country: "USA",
                    },
                },
                retryable: false,
                logs: [
                    {
                        level: "info",
                        timestamp: "2025-07-22T18:34:54.923Z",
                        message: "Order checkout initiated",
                    },
                    {
                        level: "debug",
                        timestamp: "2025-07-22T18:34:54.961Z",
                        message: "Fetching cart data for cartId: 34890",
                    },
                    {
                        level: "error",
                        timestamp: "2025-07-22T18:34:55.157Z",
                        message:
                            "Unhandled exception in OrdersService.ProcessOrder",
                    },
                ],
            },
            support: {
                contactEmail: "support@example.com",
                documentationUrl: "https://docs.example.com/errors/500",
                helpId: "ORD500X",
            },
        },
    };

    logger.info(aLargeError, "421412421", "home");
    console.log("<<<<<<<<hello");
    return (
        <Box component="main" sx={{ overflowX: "hidden" }}>
            <Homepage
                cmsContent={{
                    ...cmsContent,
                    posts: {
                        edges: sortedPosts,
                    },
                }}
            />
        </Box>
    );
}
