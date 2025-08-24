import sys
import json
from ultralytics import YOLO
from pathlib import Path
import cv2
import time

def handle_accident_detection(video_path):
    # Load the YOLO model
    model = YOLO(r"C:\Users\shash\Desktop\best.pt")  # Replace with your trained YOLO model

    # Open the video
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        return {"error": "Error opening video file"}

    frame_count = 0
    accident_detected = False
    accident_frame_count = None
    frames_to_capture = []

    # Process frames from the video
    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame_count += 1

        # Save the frame as a temporary image for YOLO processing
        temp_frame_path = f"temp_frames/frame_{frame_count}.jpg"
        Path("temp_frames").mkdir(parents=True, exist_ok=True)
        cv2.imwrite(temp_frame_path, frame)

        # Perform YOLO inference
        results = model.predict(temp_frame_path, imgsz=640, conf=0.8, verbose=False)

        # Process the results
        for result in results:
            boxes = result.boxes
            names = result.names

            for box in boxes:
                cls_id = int(box.cls)
                class_name = names[cls_id]

                # Check for accident-related classes
                if class_name in ['accident', 'moderate', 'more-severe']:
                    accident_detected = True
                    accident_frame_count = frame_count
                    frames_to_capture = [frame]
                    break

            if accident_detected:
                break

        if accident_detected:
            break

    # Capture the 4 seconds before and after the accident
    if accident_detected and accident_frame_count is not None:
        # Calculate the range of frames (4 seconds before and 4 seconds after)
        frame_rate = cap.get(cv2.CAP_PROP_FPS)
        before_frames = max(1, int(frame_rate * 4))
        after_frames = int(frame_rate * 4)

        # Go back to capture frames before the accident
        cap.set(cv2.CAP_PROP_POS_FRAMES, max(0, accident_frame_count - before_frames))

        for _ in range(before_frames):
            ret, frame = cap.read()
            if ret:
                frames_to_capture.insert(0, frame)

        # Capture frames after the accident
        for _ in range(after_frames):
            ret, frame = cap.read()
            if ret:
                frames_to_capture.append(frame)

        # Save the video in WebM format
        output_video_path = "accident_video/output_accident.webm"
        Path("accident_video").mkdir(parents=True, exist_ok=True)

        fourcc = cv2.VideoWriter_fourcc(*'VP80')  # VP8 codec for WebM
        out = cv2.VideoWriter(output_video_path, fourcc, frame_rate, (frames_to_capture[0].shape[1], frames_to_capture[0].shape[0]))

        for frame in frames_to_capture:
            out.write(frame)

        out.release()
        cap.release()

        return output_video_path

    cap.release()
    return None


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Usage: python detect_accident.py <video_path>"}))
        sys.exit(1)

    video_path = sys.argv[1]

    try:
        # Call the function to detect accident
        result = handle_accident_detection(video_path)

        # Return the result as plain text (only the path or None)
        if result:
            print(result)  # This will print the path to the 8-second video
        else:
            print("No accident detected")
    except Exception as e:
        print(json.dumps({"error": str(e)}))
