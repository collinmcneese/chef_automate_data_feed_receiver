var logger = new Logger();

(function process(/* RESTAPIRequest*/ request, /* RESTAPIResponse*/ response) {
  // logger.info("REST API call /api/x_chef_automate/asset");
  var contentType = request.getHeader('Content-Type');
  // logger.info("CONTENT TYPE: " + contentType);
  try {
    var version = request.getHeader('Chef-Data-Feed-Message-Version');
    // logger.debug("Chef-Data-Feed-Message-Version: " + version);
    var dataStream = request.body.dataStream;
    var reader = new GlideTextReader(dataStream);
    var data = '[';
    var line = '';
    var max = 16777215;
    var testMessage = '{"text":"TEST: Successful validation completed by Automate"}';
    while ((line = reader.readLine()) != null) {
      if (data.length == 1 && line === testMessage) {
        // logger.debug("received test message");
        response.setStatus(200);
        return;
      }
      if (data.length + line.length > max - 1) {
        // logger.debug(gs.getMessage("adding node will increase data {0} + {1} = ", [data.length, line.length, data.length + line.length]));
        // array of data res from stream so far
        data = data.substring(0, data.length - 1) + ']';
        // processData(data);
        data = '[' + line + ',';
      } else {
        data += line + ',';
        logger.debug(gs.getMessage('node added data.length is {0}', data.length));
      }
    }

    data = data.substring(0, data.length - 1) + ']';
    // logger.debug(gs.getMessage("node data length data.length is {0}", data.length));

    processData(data);
    response.setStatus(202);
    response.setContentType('application/json');

  } catch (err) {
    logger.errorWithStack('REST API call /api/x_chef_automate/asset error', err);
    var error = new sn_ws_err.ServiceError();
    error.setStatus(500);
    error.setMessage(err.message);
    response.setError(error);
  }

})(request, response);

function processData(assetData) {
  gs.eventQueue('x_chef_automate.chef.process.data', null, assetData, '');
}
