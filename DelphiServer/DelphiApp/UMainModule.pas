unit UMainModule;

interface

uses
  System.SysUtils, System.Classes, IdContext, IdCustomHTTPServer,
  IdBaseComponent, IdComponent, IdCustomTCPServer, IdHTTPServer, Data.DB,
  ZAbstractRODataset, ZAbstractDataset, ZAbstractTable, ZDataset,
  ZAbstractConnection, ZConnection, JSON, IdURI, IdGlobal;

type
  TMainModule = class(TDataModule)
    srvMain: TIdHTTPServer;
    SqliteConnection: TZConnection;
    tblQuotes: TZTable;
    dtsQuotes: TDataSource;
    qryRandomQuote: TZReadOnlyQuery;
    qryLoadAllQuotes: TZReadOnlyQuery;
    qryDeleteQuote: TZQuery;
    qryAddQuote: TZReadOnlyQuery;
    procedure OnSrvMainCommand(AContext: TIdContext;
      ARequestInfo: TIdHTTPRequestInfo; AResponseInfo: TIdHTTPResponseInfo);
    procedure SqliteConnectionAfterConnect(Sender: TObject);
    procedure tblQuotesAfterInsert(DataSet: TDataSet);
    procedure DataModuleCreate(Sender: TObject);
  private
    fLog: TStrings;
    function GetRandomQuote(): string;
    function GetAllQuotes(): string;
    function CreateJsonObjectFromQueryValue(query: TZReadOnlyQuery): TJsonValue;
    function DeleteQuote(quoteId: string): boolean;
    function AddQuote(quote: string; source: string): string;
  protected
    procedure OnOption(AContext: TIdContext; ARequestInfo: TIdHTTPRequestInfo; AResponseInfo: TIdHTTPResponseInfo);
    procedure OnGet(AContext: TIdContext; ARequestInfo: TIdHTTPRequestInfo; AResponseInfo: TIdHTTPResponseInfo);
    procedure OnPost(AContext: TIdContext; ARequestInfo: TIdHTTPRequestInfo; AResponseInfo: TIdHTTPResponseInfo);
    procedure OnDelete(AContext: TIdContext; ARequestInfo: TIdHTTPRequestInfo; AResponseInfo: TIdHTTPResponseInfo);
    procedure OnPut(AContext: TIdContext; ARequestInfo: TIdHTTPRequestInfo; AResponseInfo: TIdHTTPResponseInfo);
    procedure Log(message: string);
  public
    property LogLines: TStrings read fLog write fLog;
  end;

var
  MainModule: TMainModule;

implementation

{%CLASSGROUP 'Vcl.Controls.TControl'}

{$R *.dfm}

{ Preparation and Initialization }

procedure TMainModule.DataModuleCreate(Sender: TObject);
begin
  SqliteConnection.Connect();
  tblQuotes.Active := true;
  qryRandomQuote.Active := true;
  qryLoadAllQuotes.Active := true;
end;

procedure TMainModule.SqliteConnectionAfterConnect(Sender: TObject);
var
  sql: string;
begin
  SqliteConnection.AutoCommit := false;

  SqliteConnection.ExecuteDirect('CREATE TABLE IF NOT EXISTS quotes (id NVARCHAR(50) PRIMARY KEY, quote NVARCHAR(10000), source NVARCHAR(10000));');
  SqliteConnection.Commit();

  sql := 'INSERT OR IGNORE INTO quotes (id, quote, source) VALUES'
       + '("{723ccaec-5437-441b-98f8-64c0494517b5}", """Und das? Was ist das?""" || char(13) || char(10) || """Das ist blaues Licht.""" || char(13) || char(10) || """Und was macht es?""" || char(13) || char(10) || """Es leuchtet blau.""", "Rambo III"),'
       + '("{690edfd1-1d49-47ca-a9b1-9b884672906b}", "Whisky ist gut gegen Schlangenbisse, darum sollte er in keinem Schlafzimmer fehlen.", "Brendan Behan"),'
       + '("{3a96ecd1-2385-40e4-af6a-949f998c0214}", "Das Reh springt hoch, das Reh springt weit, wieso auch nicht es hat ja Zeit.", "Heinz Erhardt"),'
       + '("{5f7094d0-b745-4b91-b32f-da6c419c639f}", "Wir sollten nicht versuchen unsere Probleme zu lösen, sondern versuchen uns von den Problemen zu lösen.", "Kirpal Singh"),'
       + '("{2091752f-2917-4701-ae57-24fa86de36ef}", "Gott würfelt nicht.", "Albert Einstein"),'
       + '("{f95c00ba-1e73-4080-8688-de771f76956d}", "Verbringe die Zeit nicht mit der Suche nach einem Hindernis, vielleicht ist keins da.", "Franz Kafka"),'
       + '("{04b74be4-acb6-4612-9cfb-5bbea9675429}", "Donner ist gut und eindrucksvoll, aber die ganze Arbeit leistet der Blitz.", "Mark Twain"),'
       + '("{91b2d877-8fea-4c27-a45b-23ef707b6189}", "Ein Tag ohne Lächeln ist ein verlorener Tag.", "Charlie Chaplin"),'
       + '("{ebf98936-514c-49ae-bb3e-9b6caa7892da}", "Habe Mut, dich deines eigenen Verstandes zu bedienen.", "Immanuel Kant"),'
       + '("{4723fd88-23c0-4dfd-8b36-1d7f3ee14b51}", "Ich bleibe auf jeden Fall wahrscheinlich beim KSC.", "Sean Dundee"),'
       + '("{8da95a5a-b641-49b8-b029-e26a4a56527d}", "Jeder sollte an irgendetwas glauben, und wenn es an Fortuna Düsseldorf ist.", "Campino - Sänger ""Die Toten Hosen"""),'
       + '("{3d796d23-916d-4511-9878-e54fa193c468}", "Das Leben ist wie eine Schachtel Pralinen, man weiß nie, was man bekommt.", "Forrest Gump (1994)"),'
       + '("{04a9736d-dbb0-4403-8709-396dde5efc48}", "Dies ist nicht Vietnam, sondern Bowling, da gibt es Regeln!", "The Big Lebowski (1998)"),'
       + '("{9d45484a-366d-4e6a-aa99-da2336318e38}", "Herr Müller-Lüdenscheid, wenn sie die Ente herein lassen, lass ich das Wasser raus.", "Loriot"),'
       + '("{66ab8da3-d29d-4250-b8c4-31c17b99d823}", "Der beste Platz für Politiker ist das Wahlplakat. Dort ist er tragbar, geräuschlos und leicht zu entfernen.", "Loriot"),'
       + '("{45585bdb-889d-470b-86b8-3e5026072876}", "Man soll die Kritiker nicht für Mörder halten; sie stellen nur den Totenschein aus.", "Marcel Reich-Ranicki"),'
       + '("{7c01bb69-3573-4c67-aa7d-4e0e9c62a5e7}", "Wer einen Fehler gemacht hat und ihn nicht korrigiert, begeht einen zweiten.", "Konfuzius"),'
       + '("{48bc518d-9539-4831-b36d-9bb047f6b3a6}", "Dumm ist der, der dummes tut.", "Forrest Gump (1994)"),'
       + '("{fc582f69-42b7-4750-9fbe-d5011357a6db}", "Kämpfen nicht gut! Aber wenn kämpfen, dann gewinnen!", "Karate Kid (1984)"),'
       + '("{344fdc31-2170-42fc-bafc-6bb52d226ba3}", """Was machen Sie beruflich?""" || char(13) || char(10) ||' + '"""Nichts, was auf einem Formular besonders gut aussähe.""" || char(13) || char(10) || """Und das wäre?""" || char(13) || char(10) || """Ich bringe Menschen um.""", "James Bond 007 - Spectre");';

  SqliteConnection.ExecuteDirect(sql);
  SqliteConnection.Commit();

  SqliteConnection.AutoCommit := true;
end;

function GetNewGuid(): string;
var
   newId: TGuid;
begin
  CreateGUID(newId);
  result := GUIDToString(newId);
end;

procedure TMainModule.tblQuotesAfterInsert(DataSet: TDataSet);
begin
  tblQuotes.FieldByName('id').Value := GetNewGuid();
end;

procedure TMainModule.Log(message: string);
begin
  if not (fLog = nil) then
  begin
    fLog.Add(message);
  end;
end;

{ Data Access Methods for the Http Web API }

function TMainModule.GetAllQuotes(): string;
var
  json: TJSONArray;
begin
  json := TJSONArray.Create();
  qryLoadAllQuotes.Open();

  try
    qryLoadAllQuotes.First();

    while not qryLoadAllQuotes.Eof do
    begin
      json.AddElement(CreateJsonObjectFromQueryValue(qryLoadAllQuotes));
      qryLoadAllQuotes.Next;
    end;

    result := UTF8Encode(json.ToString());
  finally
    qryLoadAllQuotes.Close();
    json.Free();
  end;
end;

function TMainModule.GetRandomQuote(): string;
var
  json: TJsonValue;
begin
  qryRandomQuote.Open();

  try
    qryRandomQuote.First();

    json := CreateJsonObjectFromQueryValue(qryRandomQuote);

    result := UTF8Encode(json.ToString());
  finally
    qryRandomQuote.Close();
    json.Free();
  end;
end;

function TMainModule.CreateJsonObjectFromQueryValue(query: TZReadOnlyQuery): TJsonValue;
var
  json: TJsonObject;
begin
  json := TJsonObject.Create();

  json.AddPair(TJsonPair.Create(TJsonString.Create('id'), TJsonString.Create(query.FieldByName('id').Value)));
  json.AddPair(TJsonPair.Create(TJsonString.Create('quote'), TJsonString.Create(query.FieldByName('quote').Value)));
  json.AddPair(TJsonPair.Create(TJsonString.Create('source'), TJsonString.Create(query.FieldByName('source').Value)));

  result := json;
end;

function TMainModule.DeleteQuote(quoteId: string): boolean;
begin
  qryDeleteQuote.Params[0].Value := quoteId;
  qryDeleteQuote.ExecSQL();
  result := qryDeleteQuote.RowsAffected >= 1;

  qryDeleteQuote.Close();

  if (result) then
    tblQuotes.Refresh();
end;

function TMainModule.AddQuote(quote: string; source: string): string;
begin
  result := GetNewGuid();
  qryAddQuote.Params[0].Value := result;
  qryAddQuote.Params[1].Value := quote;
  qryAddQuote.Params[2].Value := source;

  qryAddQuote.ExecSQL();

  if (qryAddQuote.RowsAffected >= 1) then
  begin
    tblQuotes.Refresh();
  end else begin
    result := '';
  end;
end;


{ Actual HTTP Methodis }

procedure TMainModule.OnSrvMainCommand(AContext: TIdContext;
  ARequestInfo: TIdHTTPRequestInfo; AResponseInfo: TIdHTTPResponseInfo);
begin
  // first, prepare CORS (the hardcore way, NEVER use in production!):
  AResponseInfo.CustomHeaders.AddValue('Access-Control-Allow-Origin', '*');
  AResponseInfo.CustomHeaders.AddValue('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE');

  Log(ARequestInfo.Command + '  ' + ARequestInfo.URI + '  from ' + AContext.Connection.Socket.Binding.PeerIP);

  case ARequestInfo.CommandType of
    THTTPCommandType.hcOPTION: OnOption(AContext, ARequestInfo, AResponseInfo);
    THTTPCommandType.hcGET: OnGet(AContext, ARequestInfo, AResponseInfo);
    THTTPCommandType.hcPOST: OnPost(AContext, ARequestInfo, AResponseInfo);
    THTTPCommandType.hcDELETE: OnDelete(AContext, ARequestInfo, AResponseInfo);
    THTTPCommandType.hcPUT: OnPut(AContext, ARequestInfo, AResponseInfo);
  end;
end;

procedure TMainModule.OnOption(AContext: TIdContext; ARequestInfo: TIdHTTPRequestInfo; AResponseInfo: TIdHTTPResponseInfo);
begin
  // CORS header should suffice
end;

procedure  TMainModule.OnGet(AContext: TIdContext; ARequestInfo: TIdHTTPRequestInfo; AResponseInfo: TIdHTTPResponseInfo);
begin
  AResponseInfo.ContentType := 'application/json; charset=utf-8';

  if (ARequestInfo.URI.StartsWith('/list', true)) then
  begin
    AResponseInfo.ContentText := GetAllQuotes();
  end;

  if (ARequestInfo.URI.StartsWith('/random', true)) then
  begin
    AResponseInfo.ContentText := GetRandomQuote();
  end;
end;

procedure TMainModule.OnPost(AContext: TIdContext; ARequestInfo: TIdHTTPRequestInfo; AResponseInfo: TIdHTTPResponseInfo);
var
  requestContent: string;
  data: TJSONValue;
  newId: string;
begin
  if (ARequestInfo.URI.StartsWith('/add')) then
  begin
    requestContent := ReadStringFromStream(ARequestInfo.PostStream);

    data := TJSONObject.ParseJSONValue(requestContent);

    newId := AddQuote(data.GetValue<string>('quote'), data.GetValue<string>('source'));

    if (not (newId = '')) then
    begin
      AResponseInfo.ContentText := '{ "status": "created", "id": "' + newId + '" }';
    end else begin
      AResponseInfo.ResponseNo := 500;
      AResponseInfo.ContentText := '{ "status": "could not create entry" }';
    end;

  end;
end;

procedure TMainModule.OnDelete(AContext: TIdContext; ARequestInfo: TIdHTTPRequestInfo; AResponseInfo: TIdHTTPResponseInfo);
var
  quoteId: string;
begin
  if (ARequestInfo.URI.StartsWith('/delete/')) then
  begin
    // try to extract guid from URI
    quoteId := Copy(ARequestInfo.URI, 9, ARequestInfo.URI.Length).Trim(); // yes, strings in Delphi are indexed starting with 1 :-o
    quoteId := TIdURI.URLDecode(quoteId);
    if (quoteId.EndsWith('/')) then
      quoteId := Copy(quoteId, 1, quoteId.Length - 1);

    if (DeleteQuote(quoteId)) then begin
      AResponseInfo.ContentText := '{ "status": "deleted" }';
    end else begin
      AResponseInfo.ResponseNo := 404;
      AResponseInfo.ContentText := '{ "status": "not deleted" }';
    end;
  end;
end;

procedure TMainModule.OnPut(AContext: TIdContext; ARequestInfo: TIdHTTPRequestInfo; AResponseInfo: TIdHTTPResponseInfo);
begin
  // nothing to PUT in this case
end;

end.
