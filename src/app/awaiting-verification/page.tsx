import React from 'react'
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { getMongoUser } from "@/lib/CheckUser";

export default async function page() {
    const mongoUser = await getMongoUser();
    return (
        <div className="flex items-center justify-center min-h-screen">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <AlertCircle className="mx-auto h-12 w-12 text-yellow-500" />
                    <CardTitle className="mt-4">Verification Pending</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-muted-foreground mb-2">
                        Hello, {mongoUser?.firstName}!
                    </p>
                    <p className="text-muted-foreground">
                        Your profile has been submitted and is currently under review.
                    </p>
                    <div className="mt-6">
                        <p>Your current status is:</p>
                        <Badge variant="destructive" className="mt-2 text-lg">
                            PENDING
                        </Badge>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
