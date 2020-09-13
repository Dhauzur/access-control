<?php

namespace App\Http\Controllers;
// putenv('GOOGLE_APPLICATION_CREDENTIALS=/home/mmauroperez/online/hospedaje-sochamar/Backend/Sochamar-acceso-7f90e559d3e6.json');
putenv('GOOGLE_APPLICATION_CREDENTIALS=/home/mauro/Online/hospedaje-sochamar/Backend/Sochamar-acceso-7f90e559d3e6.json');
use App\AccessRecord;
use Google\Cloud\Vision\V1\ImageAnnotatorClient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class VisionTests extends Controller
{
  /**
   * Display a listing of the resource.
   *
   * @return \Illuminate\Http\Response
   */
  public function detect_text(Request $request)
  {
    Storage::put(''.AccessRecord::latest()->first()->id.'.png',\File::get($request->file('files')));
    $imageAnnotator = new ImageAnnotatorClient();
    $response = $imageAnnotator->textDetection(file_get_contents(public_path().'/storage/'.AccessRecord::latest()->first()->id.'.png'));
    $index = -1;
    foreach ($response->getTextAnnotations() as $text) {
      $index++;
      if (strpos($text->getDescription(), "HABITACIÓN") === 0){
          $actividad = explode("-", $response->getTextAnnotations()[$index+1]->getDescription());
          AccessRecord::create([
            'passanger-number' => $actividad[1],
            'passanger-number' => $actividad[1],
            'id-type-pension' => '1',
            'number-room' => $actividad[0],
            'state' => '1',
          ]);
          Log::info("Identificado !");
          abort(201);
          return;
      }
    }
    $imageAnnotator->close();
    Log::info("No logrado... :( ");
    abort(202);
    return;
  }

}
