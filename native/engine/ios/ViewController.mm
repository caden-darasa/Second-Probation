/****************************************************************************
 Copyright (c) 2013 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2022 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#import "ViewController.h"
#import "AppDelegate.h"
// #import <Photos/Photos.h>
#import "platform/ios/AppDelegateBridge.h"
#include "platform/apple/JsbBridge.h"
// #import <MessageUI/MessageUI.h>
//#include "cocos/platform/Device.h"
#include <iostream>
#include <fstream>

extern "C" void createFile(const char* filePath) {
    std::ofstream outputFile(filePath);

    if (outputFile.is_open()) {
        // File is open, you can proceed with writing or other operations

        outputFile << "Hello, World!" << std::endl;

        // Close the file
        outputFile.close();

        std::cout << "Bro File created and written successfully: " << filePath << std::endl;
    } else {
        // File failed to open
        std::cerr << "Bro Error creating the file: " << filePath << std::endl;
    }
}

namespace {
//    cc::Device::Orientation _lastOrientation;
}

@interface ViewController ()
 
@end

@implementation ViewController
static NSUInteger mask = UIInterfaceOrientationMaskAll;
static ViewController* instance = nil;

+(NSString *)getIdentifier{
    return [[[UIDevice currentDevice] identifierForVendor] UUIDString];
}

+(NSString *)getBundleid{
    NSString *bundleIdentifier = [[NSBundle mainBundle] bundleIdentifier];
    return bundleIdentifier;
}

+(NSString *)getDeviceName{
    return [[UIDevice currentDevice] name];
}

+(NSString *)getClipboardContent{
    UIPasteboard *pasteboard = [UIPasteboard generalPasteboard];
    NSString *string = pasteboard.string;
    if (string) {
        return string;
    }

    return @"";
}

+(void)createFileeee {
    NSString *content = @"Hello, World!";
    NSString *filePath = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES).firstObject stringByAppendingPathComponent:@"example.txt"];

    NSError *error;
    BOOL success = [content writeToFile:filePath atomically:YES encoding:NSUTF8StringEncoding error:&error];

    if (!success) {
        NSLog(@"Bro Error creating file: %@", error.localizedDescription);
    }
}

+(void)setClipboardContent:(NSString *)text {
    UIPasteboard* pasteboard = [UIPasteboard generalPasteboard];
    pasteboard.string = text;
}

+(void)setKeepScreenOn:(BOOL)val {
    [[UIApplication sharedApplication] setIdleTimerDisabled: val];
}

+(NSString *)getAppVersionCode{
    return @"1.3";
}

+(void)rotateScreen:(int)orient {
    mask = UIInterfaceOrientationMaskPortrait;
    NSNumber *value = [NSNumber numberWithInt:UIInterfaceOrientationPortrait];
    if(orient == 1){
        mask = UIInterfaceOrientationMaskLandscape;
        value = [NSNumber numberWithInt:UIInterfaceOrientationLandscapeLeft];
    }else if(orient == 2){
        mask = UIInterfaceOrientationMaskPortraitUpsideDown;
        value = [NSNumber numberWithInt:UIInterfaceOrientationPortraitUpsideDown];
    }else if(orient == 3){
        mask = UIInterfaceOrientationMaskLandscape;
        value = [NSNumber numberWithInt:UIInterfaceOrientationLandscapeRight];
    }
    
    if (@available(iOS 16.0, *)) {
        NSArray *array = [[[UIApplication sharedApplication] connectedScenes] allObjects];
        UIWindowScene *scene = (UIWindowScene *)array[0];
        
        UIWindowSceneGeometryPreferencesIOS *geometryPreferences = [[UIWindowSceneGeometryPreferencesIOS alloc] initWithInterfaceOrientations:mask];
        [scene requestGeometryUpdateWithPreferences:geometryPreferences errorHandler:^(NSError * _Nonnull error) { }];
        [instance setNeedsUpdateOfSupportedInterfaceOrientations];
        [instance.navigationController setNeedsUpdateOfSupportedInterfaceOrientations];
    }else{
        dispatch_async(dispatch_get_main_queue(), ^{
            [[UIDevice currentDevice] setValue:value forKey:@"orientation"];
            [UIViewController attemptRotationToDeviceOrientation];
        });
    }
}

- (UIInterfaceOrientationMask)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)window {
    // CCLOG("supportedInterfaceOrientationsForWindow mask: ", mask);
    
    return mask;
}

-(UIInterfaceOrientationMask)supportedInterfaceOrientations {
    return mask; // or any other specific orientations you want to support
}

+(Boolean) getDeviceOrientationCurrent{
    UIInterfaceOrientation currentOrientation = [UIApplication sharedApplication].statusBarOrientation;
    return currentOrientation;
}

+(void)setDeviceLandscape{
//    [appController setOrientationCurrent:YES];
       //rotate device
       NSNumber *value = [NSNumber numberWithInt:UIInterfaceOrientationLandscapeRight];
       [[UIDevice currentDevice] setValue:value forKey:@"orientation"];
       [UIViewController attemptRotationToDeviceOrientation];
    
    NSLog(@"setDeviceLandscape");
    
    CGRect bounds = [[UIScreen mainScreen] bounds];
    float scale = [[UIScreen mainScreen] scale];
//    app->setScreenSize(bounds.size.height * scale, bounds.size.height * scale);
}

+(void)setDevicePortrait{
    //rotate device
    NSNumber *value = [NSNumber numberWithInt:UIInterfaceOrientationPortrait];
    [[UIDevice currentDevice] setValue:value forKey:@"orientation"];
    [UIViewController attemptRotationToDeviceOrientation];
    NSLog(@"setDevicePortrait");
    
             
    CGRect bounds = [[UIScreen mainScreen] bounds];
    float scale = [[UIScreen mainScreen] scale];
//    app->setScreenSize(bounds.size.width, bounds.size.height);
//    CGRect s = CGRectMake(0,0, bounds.size.width , bounds.size.height  );
//        appController.viewController.view.frame = s;
//
    
}

// + (void)saveImageToPhotoLibrary:(NSString *)imageData {
//     // Convert base64 image data to UIImage
//     NSData *data = [[NSData alloc] initWithBase64EncodedString:imageData options:NSDataBase64DecodingIgnoreUnknownCharacters];
//     UIImage *image = [UIImage imageWithData:data];
    
//     // Request permission to access the photo library
//     [PHPhotoLibrary requestAuthorization:^(PHAuthorizationStatus status) {
//         dispatch_async(dispatch_get_main_queue(), ^{
//             if (status == PHAuthorizationStatusAuthorized) {
//                 [self saveImage:image];
//                 JsbBridge* m = [JsbBridge sharedInstance];
//                 [m sendToScript:@"saveImageToPhotoLibrary" arg1:@"1"];
//             } else {
//                 NSLog(@"Permission to access photo library denied.");
//                 JsbBridge* m = [JsbBridge sharedInstance];
//                 [m sendToScript:@"saveImageToPhotoLibrary" arg1:@"0"];
//             }
//         });
//     }];
// }
// + (void)saveImage:(UIImage *)image {
//     // Save the image to the photo library
//     if (image) {
//         UIImageWriteToSavedPhotosAlbum(image, nil, nil, nil);
//     }
// }

+ (BOOL) isSupportSendSMS{
    // if([MFMessageComposeViewController canSendText])
    // {
    //     return true;
    // }
    return false;
}

// + (void)sendSMS: (NSString *)target withContent:(NSString *) content{
//     MFMessageComposeViewController *controller = [[[MFMessageComposeViewController alloc] init] autorelease];
//     if([MFMessageComposeViewController canSendText])
//     {
//         controller.body = content;
//         controller.recipients = [NSArray arrayWithObjects: target, nil];
//         controller.messageComposeDelegate = instance;
//         [instance presentModalViewController:controller animated:YES];
        
//     }
// }


// - (void)messageComposeViewController:(MFMessageComposeViewController *)controller didFinishWithResult:(MessageComposeResult) result
// {
    
//     [instance dismissViewControllerAnimated:YES completion:nil];
//     switch (result) {
//         case MessageComposeResultCancelled:
//             break;
//         case MessageComposeResultFailed:{
// //            [AppController showArlet: @"Thông Báo" withContent: @"Gửi tin nhắn thất bại!"];
//             break;
//         }
//         case MessageComposeResultSent:{
// //            [AppController showArlet: @"Thông Báo" withContent: @"Gửi tin nhắn thành công!"];
//             break;
//         }
//         default:
//             break;
//     }
// }

- (id)init
    {
        self = [super init];
        if (self) {
            instance = self;
        }
        return self;
    }

- (BOOL) shouldAutorotate {
    return YES;
}

//fix not hide status on ios7
- (BOOL)prefersStatusBarHidden {
    return YES;
}

// Controls the application's preferred home indicator auto-hiding when this view controller is shown.
- (BOOL)prefersHomeIndicatorAutoHidden {
    return YES;
}

- (void)viewWillTransitionToSize:(CGSize)size withTransitionCoordinator:(id<UIViewControllerTransitionCoordinator>)coordinator {
   AppDelegate* delegate = [[UIApplication sharedApplication] delegate];
   [delegate.appDelegateBridge viewWillTransitionToSize:size withTransitionCoordinator:coordinator];
   float pixelRatio = [delegate.appDelegateBridge getPixelRatio];

   //CAMetalLayer is available on ios8.0, ios-simulator13.0.
   CAMetalLayer *layer = (CAMetalLayer *)self.view.layer;
   CGSize tsize             = CGSizeMake(static_cast<int>(size.width * pixelRatio),
                                         static_cast<int>(size.height * pixelRatio));
   layer.drawableSize = tsize;
}

@end
